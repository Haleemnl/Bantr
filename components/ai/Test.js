
'use client';

import React from 'react';
import { useChat } from 'ai/react';

const Chat = ({ user }) => {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        maxSteps: 5,
    });

    // Helper function to format tool invocation results
    const formatToolResult = (toolInvocations) => {
        if (!toolInvocations || !toolInvocations.length) return null;

        // Get the tweets from the result
        const tweets = toolInvocations[0]?.result?.tweets || [];
        return tweets.map((tweet, index) => tweet.tweet).join('\n\n');
    };

    return (

        <div className="flex flex-col h-dvh">
            {/* Messages container - takes all available space and scrolls when needed */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-2xl mx-auto space-y-4 pb-4">
                    {messages.map((message, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-lg ${message.role === 'user'
                                ? 'border ml-auto max-w-[80%] bg-blue-50 dark:bg-blue-900/20'
                                : 'border mr-auto max-w-[80%] bg-gray-50 dark:bg-gray-900/30'
                                }`}
                        >
                            {/* message header */}
                            <p className="font-semibold mb-1 font-serif">
                                {message.role === 'user' ? user.user_metadata.full_name : 'Bantr AI'}
                            </p>
                            {/* message body */}
                            <p className="whitespace-pre-wrap">
                                {message.toolInvocations
                                    ? formatToolResult(message.toolInvocations)
                                    : message.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input form - fixed at the bottom */}
            <div className="border-t p-4 mb-10">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!input.trim()}
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};



export default Chat;