"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useConvex } from "convex/react";

interface InboxTask {
  _id: string;
  _creationTime: number;
  userId: string;
  grantId: string;
  messageId: string;
  subject?: string;
  from?: { email: string; name?: string }[];
  to?: { email: string; name?: string }[];
  title: string;
  sentence?: string;
  actionType?: 'do' | 'schedule' | 'delegate' | 'defer';
  ownership?: 'user' | 'other' | 'unknown';
  contextBefore?: string;
  contextAfter?: string;
  detectedDeadlineText?: string;
  detectedDeadlineISO?: string | null;
  confidence: number;
  status: 'pending_confirmation' | 'confirmed' | 'ignored';
  receivedAt?: string;
}


export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const convex = useConvex();
  const [tasks, setTasks] = useState<InboxTask[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-load inbox tasks when user is signed in
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      loadInboxTasks();
    }
  }, [isSignedIn, isLoaded]);

  const handleConnectGmail = async () => {
    try {
      setConnecting(true);
      setError(null);
      
      const result = await convex.action('app/nylas:startOAuthFlow' as any, {
        redirectUri: `${window.location.origin}/integrations/nylas/callback`,
      });
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No URL returned from action');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Gmail');
      setConnecting(false);
    }
  };

  const loadInboxTasks = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await convex.query('app/nylas:listInboxTasks' as any, {
        limit: 50,
        cursor,
      });
      
      
      // Handle the actual response structure - it's a direct array
      const tasksArray = Array.isArray(res) ? res : [];
      
      if (cursor) {
        setTasks(prev => [...prev, ...tasksArray]);
      } else {
        setTasks(tasksArray);
      }
      // Note: No nextCursor since the backend returns a direct array
      setNextCursor(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbox tasks');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTypeColor = (actionType?: string) => {
    switch (actionType) {
      case 'do': return 'bg-red-100 text-red-800';
      case 'schedule': return 'bg-blue-100 text-blue-800';
      case 'delegate': return 'bg-purple-100 text-purple-800';
      case 'defer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending_confirmation': return 'bg-orange-100 text-orange-800';
      case 'ignored': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Nylas Inbox Tasks</h1>
          <p className="text-gray-600 mb-8">Sign in to connect Gmail and view your inbox tasks</p>
          
          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </Link>
            
            <Link
              href="/sign-up"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Create Account
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Secure authentication powered by Clerk
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inbox Tasks</h1>
              <p className="text-sm text-gray-600">
                {user?.firstName ? `Welcome, ${user.firstName}` : "Welcome"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleConnectGmail}
                disabled={connecting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {connecting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Connect Gmail
                  </>
                )}
              </button>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="animate-spin mx-auto h-8 w-8 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading inbox tasks...</p>
          </div>
        ) : (!tasks || tasks.length === 0) ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No inbox tasks found</h3>
            <p className="text-gray-600 mb-6">
              Connect your Gmail account to start extracting tasks from your inbox
            </p>
            <button
              onClick={() => loadInboxTasks()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Refresh Tasks
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {tasks?.length || 0} task{(tasks?.length || 0) !== 1 ? 's' : ''} found
              </p>
              <button
                onClick={() => loadInboxTasks()}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            <div className="space-y-4">
              {(tasks || []).map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      {task.subject && (
                        <p className="text-sm text-gray-600 mb-2">
                          Subject: {task.subject}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.actionType && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionTypeColor(task.actionType)}`}>
                          {task.actionType}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {task.sentence && (
                    <p className="text-gray-700 mb-3">{task.sentence}</p>
                  )}

                   <div className="grid grid-cols-2 gap-4 text-sm">
                     {task.from && task.from.length > 0 && (
                       <div>
                         <span className="text-gray-500">From:</span>
                         <p className="text-gray-900">
                           {task.from[0].name || task.from[0].email}
                         </p>
                       </div>
                     )}
                     {task.detectedDeadlineISO && (
                       <div>
                         <span className="text-gray-500">Deadline:</span>
                         <p className="text-gray-900">
                           {formatDate(task.detectedDeadlineISO)}
                         </p>
                         {task.detectedDeadlineText && (
                           <p className="text-xs text-gray-600">
                             "{task.detectedDeadlineText}"
                           </p>
                         )}
                       </div>
                     )}
                     {task.receivedAt && (
                       <div>
                         <span className="text-gray-500">Received:</span>
                         <p className="text-gray-900">
                           {formatDate(task.receivedAt)}
                         </p>
                       </div>
                     )}
                     <div>
                       <span className="text-gray-500">Confidence:</span>
                       <p className="text-gray-900">
                         {(task.confidence * 100).toFixed(0)}%
                       </p>
                     </div>
                   </div>
                   
                   {/* Show context if available */}
                   {(task.contextBefore || task.contextAfter) && (
                     <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                       <p className="text-xs text-gray-500 mb-1">Email Context:</p>
                       {task.contextBefore && (
                         <p className="text-sm text-gray-600 mb-1">"{task.contextBefore}"</p>
                       )}
                       {task.contextAfter && (
                         <p className="text-sm text-gray-600">"{task.contextAfter}"</p>
                       )}
                     </div>
                   )}
                </div>
              ))}
            </div>

            {nextCursor && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => loadInboxTasks(nextCursor)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
