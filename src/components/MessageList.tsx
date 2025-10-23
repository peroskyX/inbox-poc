"use client";

import {
  useThreadMessages,
  toUIMessages,
  useSmoothText,
  type UIMessage,
  optimisticallySendMessage,
} from "@convex-dev/agent/react";
import { isToolUIPart, getToolName } from "ai";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "../../api";
import { getRandomThinkingMessage } from "@/lib/thinkingMessages";

interface MessageListProps {
  threadId: string;
  onPendingApprovalChange?: (hasPending: boolean) => void;
  optimisticMessages?: UIMessage[];
  onOptimisticMessagesClear?: () => void;
}

type ToolResultPayload = {
  selectionId?: string;
  selectionTitle?: string;
  selectionType?: string;
  selectionStartDate?: string;
};

function formatDateTime(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Helper function to extract tool name and generate a friendly status message
 * based on the tool being executed
 */
function getToolStatusMessage(parts: UIMessage["parts"]): string | null {
  if (!parts || parts.length === 0) return null;

  // Find a tool part that's not waiting for user approval
  const toolPart = parts.find(
    (p) =>
      p.type.startsWith("tool-") &&
      "state" in p &&
      p.state !== "input-available",
  );

  if (!toolPart) return null;

  // Map tool types to friendly messages
  const toolMessages: Record<string, string> = {
    "tool-getSchedule": "Checking your schedule...",
    "tool-searchSchedule": "Searching your schedule...",
    "tool-checkAvailability": "Finding available times...",
    "tool-createSchedule": "Creating schedule item(s)...",
    "tool-updateSchedule": "Updating schedule item(s)...",
    "tool-removeSchedule": "Removing schedule item(s)...",
    "tool-getEnergy": "Analyzing your energy patterns...",
    "tool-getSleep": "Checking your sleep data...",
  };

  return toolMessages[toolPart.type] || "Working on it...";
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="text-sm text-gray-700 flex justify-between">
      <span className="font-medium text-gray-800">{label}</span>
      <span className="text-right text-gray-600">{value}</span>
    </div>
  );
}

interface ToolApprovalCardProps {
  toolName: string;
  toolCallId: string;
  input: Record<string, unknown> | undefined;
  onAddToolResult?: (result: {
    toolCallId: string;
    tool: string;
    output: string;
    payload?: ToolResultPayload;
  }) => Promise<void>;
}

interface BatchToolApprovalCardProps {
  toolName: string;
  toolCallId: string;
  input: Record<string, unknown> | undefined;
  onAddToolResult: (result: {
    toolCallId: string;
    tool: string;
    output: string;
    payload?: Record<string, unknown>;
  }) => Promise<void>;
}

interface BatchCreateApprovalCardProps {
  toolName: string;
  toolCallId: string;
  input: Record<string, unknown> | undefined;
  onAddToolResult: (result: {
    toolCallId: string;
    tool: string;
    output: string;
    payload?: Record<string, unknown>;
  }) => Promise<void>;
}

interface BatchRemoveApprovalCardProps {
  toolName: string;
  toolCallId: string;
  input: Record<string, unknown> | undefined;
  onAddToolResult: (result: {
    toolCallId: string;
    tool: string;
    output: string;
    payload?: Record<string, unknown>;
  }) => Promise<void>;
}

function BatchToolApprovalCard({
  toolName,
  toolCallId,
  input,
  onAddToolResult,
}: BatchToolApprovalCardProps) {
  const [selectedIds, setSelectedIds] = useState<Map<number, string>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract operations array from input
  const operations = useMemo(() => {
    if (!isRecord(input) || !Array.isArray(input.operations)) {
      return [] as Array<{ query: string; updates: Record<string, unknown> }>;
    }
    return input.operations as Array<{ query: string; updates: Record<string, unknown> }>;
  }, [input]);

  // Fetch search results for all operations in parallel
  const searchQueries = useMemo(() => {
    return operations.map(op => ({ query: op.query }));
  }, [operations]);

  // We'll fetch results for each query - in a real implementation you might batch this
  const searchResults = operations.map((op, idx) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const results = useQuery(
      api.app.schedules.searchSchedule,
      { query: op.query } as any,
    ) as Array<Record<string, any>> | undefined;
    return { operationIndex: idx, query: op.query, results: results || [] };
  });

  const handleDecision = async (approved: boolean) => {
    if (!approved) {
      try {
        setSubmitting(true);
        await onAddToolResult?.({
          toolCallId,
          tool: toolName,
          output: "denied",
        });
      } catch (err) {
        console.error("Failed to submit denial", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Build selections array
    const selections: Array<{ operationIndex: number; selectionId: string }> = [];
    for (const [operationIndex, selectionId] of selectedIds.entries()) {
      selections.push({ operationIndex, selectionId });
    }

    if (selections.length === 0) {
      setError("Please select at least one item to update");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddToolResult?.({
        toolCallId,
        tool: toolName,
        output: "approved",
        payload: { selections },
      });
    } catch (err) {
      console.error("Failed to submit tool result", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectionChange = (operationIndex: number, selectionId: string) => {
    setSelectedIds(prev => {
      const newMap = new Map(prev);
      newMap.set(operationIndex, selectionId);
      return newMap;
    });
  };

  const userMessage =
    isRecord(input) && typeof input.userMessage === "string"
      ? input.userMessage
      : null;

  const approveDisabled = submitting || selectedIds.size === 0;

  return (
    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md space-y-3">
      <div>
        <p className="text-gray-800 font-semibold">
          Batch Update: {operations.length} schedule items
        </p>
      </div>

      {/* Display AI-generated user message */}
      {userMessage && (
        <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-gray-700 italic">💬 {userMessage}</p>
        </div>
      )}

      {/* Display each operation with its search results */}
      <div className="space-y-4">
        {searchResults.map((searchResult) => {
          const operation = operations[searchResult.operationIndex];
          const topMatches = searchResult.results.slice(0, 3);
          const selectedId = selectedIds.get(searchResult.operationIndex);
          const updateEntries = Object.entries(operation.updates).filter(
            ([, value]) => value !== undefined && value !== null,
          );

          return (
            <div
              key={searchResult.operationIndex}
              className="bg-white border border-gray-200 rounded-md p-3 space-y-2"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-800">
                  {searchResult.operationIndex + 1}. Query: "
                  {searchResult.query}"
                </p>
                {updateEntries.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {updateEntries.length} update(s)
                  </div>
                )}
              </div>

              {/* Show proposed updates */}
              {updateEntries.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded p-2">
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    Proposed updates:
                  </p>
                  <div className="space-y-1">
                    {updateEntries.map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700 capitalize">
                          {key}:
                        </span>
                        <span className="text-gray-600">
                          {formatDateTime(value) ??
                            (Array.isArray(value)
                              ? value.join(", ")
                              : String(value))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show matches */}
              {topMatches.length === 0 ? (
                <p className="text-xs text-gray-600">
                  No matches found for this query
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">
                    Select the item to update:
                  </p>
                  {topMatches.map((match) => (
                    <label
                      key={match._id}
                      className={`flex items-start space-x-2 border rounded p-2 cursor-pointer transition text-sm ${
                        selectedId === match._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`batch-${toolCallId}-op-${searchResult.operationIndex}`}
                        className="mt-0.5"
                        checked={selectedId === match._id}
                        onChange={() =>
                          handleSelectionChange(
                            searchResult.operationIndex,
                            match._id,
                          )
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800 truncate">
                            {match.title}
                          </span>
                          <span className="uppercase text-xs tracking-wide text-gray-500 ml-2">
                            {match.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5">
                          {match.status && <div>Status: {match.status}</div>}
                          {match.startDate && (
                            <div>Starts: {formatDateTime(match.startDate)}</div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between items-center pt-2 border-t border-yellow-300">
        <p className="text-xs text-gray-600">
          Selected: {selectedIds.size} of {operations.length}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDecision(true)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={approveDisabled}
          >
            Approve All
          </button>
          <button
            onClick={() => handleDecision(false)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}

function BatchCreateApprovalCard({
  toolName,
  toolCallId,
  input,
  onAddToolResult,
}: BatchCreateApprovalCardProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract items array from input
  const items = useMemo(() => {
    if (!isRecord(input) || !Array.isArray(input.items)) {
      return [] as Array<Record<string, unknown>>;
    }
    return input.items as Array<Record<string, unknown>>;
  }, [input]);

  const handleDecision = async (approved: boolean) => {
    try {
      setSubmitting(true);
      setError(null);
      await onAddToolResult?.({
        toolCallId,
        tool: toolName,
        output: approved ? "approved" : "denied",
      });
    } catch (err) {
      console.error("Failed to submit tool result", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const userMessage =
    isRecord(input) && typeof input.userMessage === "string"
      ? input.userMessage
      : null;

  return (
    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md space-y-3">
      <div>
        <p className="text-gray-800 font-semibold">
          Batch Create: {items.length} schedule items
        </p>
      </div>

      {/* Display AI-generated user message */}
      {userMessage && (
        <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-gray-700 italic">💬 {userMessage}</p>
        </div>
      )}

      {/* Display each item to be created */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-md p-3 space-y-1"
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-gray-800">
                {index + 1}. {item.title as string}
              </p>
              <span className="text-xs uppercase tracking-wide text-gray-500">
                {item.type as string}
              </span>
            </div>
            <DetailRow
              label="Start"
              value={formatDateTime(item.startDate)}
            />
            <DetailRow
              label="End"
              value={formatDateTime(item.endDate)}
            />
            <DetailRow
              label="Duration"
              value={
                typeof item.estimatedDuration === "number"
                  ? `${item.estimatedDuration} mins`
                  : undefined
              }
            />
            <DetailRow
              label="Tag"
              value={typeof item.tag === "string" ? item.tag : undefined}
            />
            {typeof item.description === "string" && item.description && (
              <div className="text-sm text-gray-600 pt-1 border-t border-gray-100">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex space-x-2 pt-2 border-t border-yellow-300">
        <button
          onClick={() => handleDecision(true)}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          Approve All ({items.length})
        </button>
        <button
          onClick={() => handleDecision(false)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          Deny
        </button>
      </div>
    </div>
  );
}

function BatchRemoveApprovalCard({
  toolName,
  toolCallId,
  input,
  onAddToolResult,
}: BatchRemoveApprovalCardProps) {
  const [selectedIds, setSelectedIds] = useState<Map<number, string>>(new Map());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract queries array from input
  const queries = useMemo(() => {
    if (!isRecord(input) || !Array.isArray(input.queries)) {
      return [] as string[];
    }
    return input.queries as string[];
  }, [input]);

  // Fetch search results for all queries in parallel
  const searchResults = queries.map((query, idx) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const results = useQuery(
      api.app.schedules.searchSchedule,
      { query } as any,
    ) as Array<Record<string, any>> | undefined;
    return { queryIndex: idx, query, results: results || [] };
  });

  const handleDecision = async (approved: boolean) => {
    if (!approved) {
      try {
        setSubmitting(true);
        await onAddToolResult?.({
          toolCallId,
          tool: toolName,
          output: "denied",
        });
      } catch (err) {
        console.error("Failed to submit denial", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Build selections array
    const selections: Array<{ queryIndex: number; selectionId: string }> = [];
    for (const [queryIndex, selectionId] of selectedIds.entries()) {
      selections.push({ queryIndex, selectionId });
    }

    if (selections.length === 0) {
      setError("Please select at least one item to remove");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onAddToolResult?.({
        toolCallId,
        tool: toolName,
        output: "approved",
        payload: { selections },
      });
    } catch (err) {
      console.error("Failed to submit tool result", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectionChange = (queryIndex: number, selectionId: string) => {
    setSelectedIds(prev => {
      const newMap = new Map(prev);
      newMap.set(queryIndex, selectionId);
      return newMap;
    });
  };

  const userMessage =
    isRecord(input) && typeof input.userMessage === "string"
      ? input.userMessage
      : null;

  const reason =
    isRecord(input) && typeof input.reason === "string"
      ? input.reason
      : null;

  const approveDisabled = submitting || selectedIds.size === 0;

  return (
    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md space-y-3">
      <div>
        <p className="text-gray-800 font-semibold">
          Batch Remove: {queries.length} schedule items
        </p>
      </div>

      {/* Display AI-generated user message */}
      {userMessage && (
        <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-gray-700 italic">💬 {userMessage}</p>
        </div>
      )}

      {/* Display reason if provided */}
      {reason && (
        <div className="p-2 bg-white border border-red-100 rounded">
          <p className="text-xs font-medium text-red-800 mb-1">Reason:</p>
          <p className="text-sm text-gray-700">{reason}</p>
        </div>
      )}

      {/* Display each query with its search results */}
      <div className="space-y-4">
        {searchResults.map((searchResult) => {
          const topMatches = searchResult.results.slice(0, 3);
          const selectedId = selectedIds.get(searchResult.queryIndex);

          return (
            <div
              key={searchResult.queryIndex}
              className="bg-white border border-gray-200 rounded-md p-3 space-y-2"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-800">
                  {searchResult.queryIndex + 1}. Query: "{searchResult.query}"
                </p>
              </div>

              {/* Show matches */}
              {topMatches.length === 0 ? (
                <p className="text-xs text-gray-600">
                  No matches found for this query
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">
                    Select the item to remove:
                  </p>
                  {topMatches.map((match) => (
                    <label
                      key={match._id}
                      className={`flex items-start space-x-2 border rounded p-2 cursor-pointer transition text-sm ${
                        selectedId === match._id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white hover:border-red-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`batch-remove-${toolCallId}-query-${searchResult.queryIndex}`}
                        className="mt-0.5"
                        checked={selectedId === match._id}
                        onChange={() =>
                          handleSelectionChange(
                            searchResult.queryIndex,
                            match._id,
                          )
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800 truncate">
                            {match.title}
                          </span>
                          <span className="uppercase text-xs tracking-wide text-gray-500 ml-2">
                            {match.type}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5">
                          {match.status && <div>Status: {match.status}</div>}
                          {match.startDate && (
                            <div>Starts: {formatDateTime(match.startDate)}</div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between items-center pt-2 border-t border-red-300">
        <p className="text-xs text-gray-600">
          Selected: {selectedIds.size} of {queries.length}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleDecision(true)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={approveDisabled}
          >
            Remove All
          </button>
          <button
            onClick={() => handleDecision(false)}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolApprovalCard({
  toolName,
  toolCallId,
  input,
  onAddToolResult,
}: ToolApprovalCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUpdate = toolName === "updateSchedule";
  const isRemove = toolName === "removeSchedule";
  const isCreate = toolName === "createSchedule";

  // Extract first element from arrays for single operations
  // createSchedule: items[0]
  // updateSchedule: operations[0]
  // removeSchedule: queries[0]
  const singleItem = useMemo(() => {
    if (!isRecord(input)) return null;
    if (isCreate && Array.isArray(input.items) && input.items.length === 1) {
      return input.items[0] as Record<string, unknown>;
    }
    return null;
  }, [input, isCreate]);

  const singleOperation = useMemo(() => {
    if (!isRecord(input)) return null;
    if (isUpdate && Array.isArray(input.operations) && input.operations.length === 1) {
      return input.operations[0] as { query: string; updates: Record<string, unknown> };
    }
    return null;
  }, [input, isUpdate]);

  const singleQuery = useMemo(() => {
    if (!isRecord(input)) return "";
    if (isRemove && Array.isArray(input.queries) && input.queries.length === 1) {
      return input.queries[0] as string;
    }
    return "";
  }, [input, isRemove]);

  const searchQuery =
    isUpdate && singleOperation
      ? singleOperation.query
      : isRemove && singleQuery
        ? singleQuery
        : "";

  const searchArgs = searchQuery ? { query: searchQuery } : undefined;
  const searchResults = useQuery(
    api.app.schedules.searchSchedule,
    (searchArgs ?? "skip") as any,
  ) as Array<Record<string, any>> | undefined;

  const topMatches = useMemo(() => {
    if (!Array.isArray(searchResults)) {
      return [] as Array<Record<string, any>>;
    }
    return searchResults.slice(0, 3);
  }, [searchResults]);

  const updateEntries = useMemo(() => {
    if (!isUpdate || !singleOperation) {
      return [] as Array<[string, unknown]>;
    }
    return Object.entries(singleOperation.updates).filter(
      ([, value]) => value !== undefined && value !== null,
    );
  }, [singleOperation, isUpdate]);

  const actionDescription =
    {
      createSchedule: "Create a new schedule item",
      updateSchedule: "Update an existing schedule item",
      removeSchedule: "Remove a schedule item",
    }[toolName] ?? "Tool execution requires approval";

  const handleDecision = async (
    approved: boolean,
    payload?: ToolResultPayload,
  ) => {
    try {
      setSubmitting(true);
      setError(null);
      await onAddToolResult?.({
        toolCallId,
        tool: toolName,
        output: approved ? "approved" : "denied",
        payload,
      });
    } catch (err) {
      console.error("Failed to submit tool result", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMatch =
    topMatches.find((match) => match._id === selectedId) ?? null;

  const approveDisabled = (() => {
    if (submitting) return true;
    if (isUpdate || isRemove) {
      if (!searchQuery) return true;
      if (!Array.isArray(searchResults)) return true;
      if (!selectedMatch) return true;
    }
    return false;
  })();

  // Extract userMessage from input
  const userMessage =
    isRecord(input) && typeof input.userMessage === "string"
      ? input.userMessage
      : null;

  return (
    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md space-y-3">
      <div>
        <p className="text-gray-800 font-semibold">{actionDescription}</p>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-1">
            Search query: <span className="font-medium">{searchQuery}</span>
          </p>
        )}
      </div>

      {/* Display AI-generated user message */}
      {userMessage && (
        <div className="p-2 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-sm text-gray-700 italic">💬 {userMessage}</p>
        </div>
      )}

      {isCreate && isRecord(input) && (
        <div className="space-y-1 bg-white border border-gray-200 rounded-md p-3">
          <DetailRow
            label="Type"
            value={typeof input.type === "string" ? input.type : undefined}
          />
          <DetailRow
            label="Title"
            value={typeof input.title === "string" ? input.title : undefined}
          />
          <DetailRow label="Start" value={formatDateTime(input.startDate)} />
          <DetailRow label="End" value={formatDateTime(input.endDate)} />
          <DetailRow
            label="Duration"
            value={
              typeof input.estimatedDuration === "number"
                ? `${input.estimatedDuration} mins`
                : undefined
            }
          />
        </div>
      )}

      {isUpdate && updateEntries.length > 0 && (
        <div className="bg-white border border-blue-100 rounded-md p-3">
          <p className="text-sm font-medium text-blue-800 mb-2">
            Proposed updates
          </p>
          <ul className="space-y-1 text-sm text-gray-700">
            {updateEntries.map(([key, value]) => (
              <li key={key} className="flex justify-between">
                <span className="font-medium text-gray-800 capitalize">
                  {key}
                </span>
                <span className="text-right text-gray-600">
                  {formatDateTime(value) ??
                    (Array.isArray(value) ? value.join(", ") : String(value))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isRemove &&
        isRecord(input) &&
        typeof input.reason === "string" &&
        input.reason.trim().length > 0 && (
          <div className="bg-white border border-red-100 rounded-md p-3">
            <p className="text-sm font-medium text-red-800 mb-1">
              Reason provided
            </p>
            <p className="text-sm text-gray-700">{input.reason}</p>
          </div>
        )}

      {(isUpdate || isRemove) && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">
            Select the correct schedule item
          </p>
          {!searchQuery && (
            <p className="text-sm text-gray-600">
              This tool call did not include a search query.
            </p>
          )}
          {searchQuery && !Array.isArray(searchResults) && (
            <p className="text-sm text-gray-600">Loading matches...</p>
          )}
          {searchQuery &&
            Array.isArray(searchResults) &&
            topMatches.length === 0 && (
              <p className="text-sm text-gray-600">
                No matches found for this query. You can deny the request or ask
                the assistant to clarify.
              </p>
            )}
          {topMatches.length > 0 && (
            <div className="space-y-2">
              {topMatches.map((match) => (
                <label
                  key={match._id}
                  className={`flex items-start space-x-3 border rounded-md p-3 cursor-pointer transition ${
                    selectedId === match._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`tool-${toolCallId}`}
                    className="mt-1"
                    checked={selectedId === match._id}
                    onChange={() => setSelectedId(match._id)}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-800">
                        {match.title}
                      </span>
                      <span className="uppercase text-xs tracking-wide text-gray-500">
                        {match.type}
                      </span>
                    </div>
                    <DetailRow
                      label="Status"
                      value={
                        typeof match.status === "string"
                          ? match.status
                          : undefined
                      }
                    />
                    <DetailRow
                      label="Starts"
                      value={formatDateTime(match.startDate)}
                    />
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex space-x-2">
        <button
          onClick={() =>
            handleDecision(
              true,
              selectedMatch
                ? {
                    selectionId: selectedMatch._id,
                    selectionTitle: selectedMatch.title,
                    selectionType: selectedMatch.type,
                    selectionStartDate:
                      typeof selectedMatch.startDate === "string"
                        ? selectedMatch.startDate
                        : undefined,
                  }
                : undefined,
            )
          }
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={approveDisabled}
        >
          Approve
        </button>
        <button
          onClick={() => handleDecision(false)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          Deny
        </button>
      </div>
    </div>
  );
}

function Message({
  message,
  onAddToolResult,
}: {
  message: UIMessage;
  onAddToolResult?: (result: {
    toolCallId: string;
    tool: string;
    output: string;
    payload?: ToolResultPayload;
  }) => Promise<void>;
}) {
  const [visibleText] = useSmoothText(message.text, {
    startStreaming: message.status === "streaming",
  });

  // Generate a random thinking message once for this message
  const [thinkingMessage] = useState(() => getRandomThinkingMessage());

  console.log("message", JSON.stringify(message));

  // Determine status message for assistant
  const isPending = message.status === "pending";
  const isThinking =
    isPending && (!message.parts || message.parts.length === 0);
  const toolStatusMessage = isPending
    ? getToolStatusMessage(message.parts)
    : null;

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          message.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div
          className={`text-sm font-semibold mb-1 ${message.role === "user" ? "text-blue-100" : "text-gray-700"}`}
        >
          {message.role === "user" ? "You" : message.agentName || "Assistant"}
        </div>

        {/* Status indicators for assistant messages */}
        {message.role === "assistant" && (
          <>
            {/* Pending - thinking state */}
            {isThinking && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{thinkingMessage}</span>
              </div>
            )}

            {/* Pending - tool execution state */}
            {toolStatusMessage && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{toolStatusMessage}</span>
              </div>
            )}
          </>
        )}

        {/* Render message parts */}
        {message.parts?.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className={`whitespace-pre-wrap break-words ${
                  message.role === "user" ? "text-white" : "text-gray-900"
                } text-base leading-relaxed`}
              >
                {part.text}
              </div>
            );
          }

          // Handle tool approval UI
          if (isToolUIPart(part)) {
            const toolName = getToolName(part);
            const toolCallId = part.toolCallId;

            // Render approval UI for tools requiring confirmation
            if (part.state === "input-available") {
              const input = isRecord(part.input) ? part.input : undefined;

              // Determine if this is a batch operation by checking array length
              // createSchedule uses 'items' array - always use batch card to match mobile app pattern
              // updateSchedule uses 'operations' array
              // removeSchedule uses 'queries' array
              const isBatchOperation = (() => {
                if (!input) return false;
                if (toolName === "createSchedule" && Array.isArray(input.items)) {
                  return true; // Always use batch card for createSchedule (handles 1 or many items)
                }
                if (toolName === "updateSchedule" && Array.isArray(input.operations)) {
                  return input.operations.length > 1;
                }
                if (toolName === "removeSchedule" && Array.isArray(input.queries)) {
                  return input.queries.length > 1;
                }
                return false;
              })();

              // Route to batch UI if multiple items
              if (isBatchOperation) {
                if (toolName === "updateSchedule") {
                  return (
                    <BatchToolApprovalCard
                      key={toolCallId}
                      toolName={toolName}
                      toolCallId={toolCallId}
                      input={input}
                      onAddToolResult={onAddToolResult || (() => Promise.resolve())}
                    />
                  );
                }
                if (toolName === "createSchedule") {
                  return (
                    <BatchCreateApprovalCard
                      key={toolCallId}
                      toolName={toolName}
                      toolCallId={toolCallId}
                      input={input}
                      onAddToolResult={onAddToolResult || (() => Promise.resolve())}
                    />
                  );
                }
                if (toolName === "removeSchedule") {
                  return (
                    <BatchRemoveApprovalCard
                      key={toolCallId}
                      toolName={toolName}
                      toolCallId={toolCallId}
                      input={input}
                      onAddToolResult={onAddToolResult || (() => Promise.resolve())}
                    />
                  );
                }
              }

              // Use single approval UI for single operations
              return (
                <ToolApprovalCard
                  key={toolCallId}
                  toolName={toolName}
                  toolCallId={toolCallId}
                  input={input}
                  onAddToolResult={onAddToolResult}
                />
              );
            }
          }

          return null;
        }) || (
          // Fallback to original text rendering if no parts
          <div
            className={`whitespace-pre-wrap break-words ${
              message.role === "user" ? "text-white" : "text-gray-900"
            } text-base leading-relaxed`}
          >
            {visibleText}
          </div>
        )}

        {message.status === "streaming" && (
          <div className="mt-2 flex space-x-1">
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessageList({
  threadId,
  onPendingApprovalChange,
  optimisticMessages = [],
  onOptimisticMessagesClear,
}: MessageListProps) {
  const messages = useThreadMessages(
    api.app.chat.listThreadMessages,
    { threadId },
    { initialNumItems: 50, stream: true },
  );

  const realMessages = toUIMessages((messages.results ?? []) as any);

  // Clear optimistic messages when real messages appear
  useEffect(() => {
    if (realMessages.length > 0 && optimisticMessages.length > 0) {
      onOptimisticMessagesClear?.();
    }
  }, [realMessages.length, optimisticMessages.length, onOptimisticMessagesClear]);

  // Merge optimistic messages with real messages
  const uiMessages = useMemo(() => {
    if (optimisticMessages.length > 0) {
      return [...realMessages, ...optimisticMessages].sort((a, b) => a.order - b.order);
    }
    return realMessages;
  }, [realMessages, optimisticMessages]);

  // Detect if there are any pending approvals
  useEffect(() => {
    if (!onPendingApprovalChange) return;

    const hasPendingApproval = uiMessages.some((message) =>
      message.parts?.some(
        (part) => isToolUIPart(part) && part.state === "input-available",
      ),
    );

    onPendingApprovalChange(hasPendingApproval);
  }, [uiMessages, onPendingApprovalChange]);


  if (messages.isLoading && !messages.results) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Loading messages...
      </div>
    );
  }

  if (!uiMessages || uiMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-xl mb-2">No messages yet</p>
          <p className="text-sm">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        {uiMessages.map((message) => (
          <Message
            key={message.key}
            message={message}
          />
        ))}
      </div>
    </div>
  );
}
