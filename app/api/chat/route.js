

import { createClient } from "@/utils/supabase/server";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;


export async function POST(req) {

    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()


    const { messages } = await req.json();

    const result = streamText({
        model: openai("gpt-4o-mini"),

        system: `You are a helpful AI assistant for a web app called Bantr which allows users to write freely and express their thoughts freely. The user's full name is ${user.user_metadata.full_name} 
        You have access to the following tools:
        - getAllTweets: Get all available tweets
        - searchTweets: Search for specific tweets
        - getRecentTweets: Get the most recent tweets

        When users ask about tweets or content based on the app:
        1. Use the appropriate tool to fetch relevant information
        2. Provide specific examples from the tweets when relevant
        3. Include posting dates when mentioning specific tweets
        4.  if no relevant information is found in the tool calls, respond, "Sorry, I don't know."

        Keep responses natural and conversational while being informative.`,

        messages,
        tools: {
            // Tool to get all tweets
            getAllTweets: tool({
                description: "Get all tweets from the database",
                parameters: z.object({}), // No parameters needed
                execute: async () => {
                    const { data: posts, error } = await supabase
                        .from('posts')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(10)

                    if (error) {
                        console.error('Error fetching tweets:', error)
                        return { tweets: [] }
                    }

                    return { tweets: posts }
                },
            }),

            // Tool to search tweets
            searchTweets: tool({
                description: "Search for specific tweets in the database",
                parameters: z.object({
                    query: z.string().describe("Search term to find relevant tweets"),
                }),
                execute: async ({ query }) => {
                    const { data: posts, error } = await supabase
                        .from('posts')
                        .select('tweet, post_username')
                        .ilike('tweet', `%${query}%`)
                        .order('created_at', { ascending: false })
                        .limit(5)

                    if (error) {
                        console.error('Error searching tweets:', error)
                        return { tweets: [] }
                    }

                    return { tweets: posts }
                },
            }),

            // Tool to get recent tweets
            getRecentTweets: tool({
                description: "Get the most recent tweets",
                parameters: z.object({
                    limit: z.number().optional().describe("Number of tweets to return")
                }),
                execute: async ({ limit = 3 }) => {
                    const { data: posts, error } = await supabase
                        .from('posts')
                        // .select('*')
                        .select('tweet')
                        .order('created_at', { ascending: false })
                        .limit(limit)

                    if (error) {
                        console.error('Error fetching recent tweets:', error)
                        return { tweets: [] }
                    }

                    return { tweets: posts }
                },
            }),
        },

    });

    return result.toDataStreamResponse();
}