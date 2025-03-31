
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
        <div className="max-w-2xl mx-auto p-4">
            {/* Messages container */}
            <div className="space-y-4 mb-4">
                {messages.map((message, i) => (
                    <div key={i} className={`p-4 rounded-lg ${message.role === 'user' ? 'border ml-auto max-w-[80%]' : 'border mr-auto max-w-[80%]'}`}>

                        {/* message header */}
                        <p className="font-semibold mb-1 font-serif">
                            {message.role === 'user' ? user.user_metadata.full_name : 'Bantr AI'}
                        </p>

                        {/* message body */}
                        <p className="whitespace-pre-wrap">
                            {message.toolInvocations ? formatToolResult(message.toolInvocations) : message.content}
                        </p>

                    </div>
                ))}
            </div>



            {/* Input form */}
            <form onSubmit={handleSubmit} className="flex gap-2">

                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;