"use client";

import { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../api";

interface MessageInputProps {
  threadId: string;
  disabled?: boolean;
  onMessageSent?: (message: string) => void;
}

export default function MessageInput({ threadId, disabled = false, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useMutation(api.app.chat.sendMessage);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending || disabled) return;

    const messageToSend = message.trim();
    setMessage("");
    setIsSending(true);

    // Notify parent that message is being sent (for optimistic UI)
    onMessageSent?.(messageToSend);

    try {
      await sendMessage({
        prompt: messageToSend,
        threadId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={disabled ? "Waiting for approval..." : "Type your message..."}
            disabled={isSending || disabled}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-black"
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending || disabled}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
