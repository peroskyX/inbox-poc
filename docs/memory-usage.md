# Automatic Memory with Convex Agents

This document explains how automatic memory works in this Convex Agent project, enabling the AI to remember and reference past conversations and context across threads. Examples demonstrate how memory integrates with streaming functionality.

## Overview

The Convex Agent automatically handles memory storage and retrieval through vector embeddings and search capabilities. No manual memory management is required - the system automatically stores conversation history and can search across it when needed.

## Memory Configuration

Memory is enabled through the agent configuration in `convex/chat.ts:82-86`:

```typescript
const agent = new Agent(components.agent, {
  name: "My Agent",
  languageModel: openai.chat("gpt-4o-mini"),
  textEmbeddingModel: openai.embedding("text-embedding-3-small"), // Enables memory
});
```

The `textEmbeddingModel` is the key component that enables automatic memory functionality by converting conversations into searchable vector embeddings.

## Memory with Streaming Implementation

The complete memory and streaming implementation is found in the `generateResponse` function in `convex/chat.ts:235-294`:

### Basic Stream Creation with Memory

```typescript
export const generateResponse = internalAction({
  args: v.object({
    input: v.union(
      v.object({
        prompt: v.string(),
        threadId: v.string(),
        userId: v.string(),
      }),
      // ... other input types
    ),
  }),
  handler: async (ctx, args) => {
    const { threadId, userId } = args.input;
    const { thread } = await agent.continueThread(ctx, { threadId, userId });

    // Create streaming response with memory
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        try {
          const result = await thread.streamText(
            {
              prompt: args.input.prompt, // Simple prompt input
            },
            {
              saveStreamDeltas: true,
              contextOptions: {
                searchOptions: {
                  vectorSearch: true,        // Enable memory search
                  limit: 10,                 // Memory results limit
                },
                searchOtherThreads: true,    // Cross-thread memory
              },
            },
          );

          writer.merge(result.toUIMessageStream({ originalMessages: [] }));
        } catch (error) {
          console.error(error);
        }
      },
    });

    // Consume stream for proper execution
    for await (const _chunk of readUIMessageStream({ stream })) {
      // Stream must be consumed for side effects
    }
  },
});
```

## Memory Configuration Options

The key memory features are activated through the `contextOptions`:

```typescript
{
  saveStreamDeltas: true,           // Save all conversation parts for memory
  contextOptions: {
    searchOptions: {
      vectorSearch: true,           // Enable vector-based memory search
      limit: 10,                    // Limit memory results returned
    },
    searchOtherThreads: true,       // Search across all user threads
  },
}
```

### Memory Settings Explained

- **`vectorSearch: true`**: Enables automatic vector-based search through conversation history
- **`searchOtherThreads: true`**: Allows the agent to access memory from other conversation threads by the same user
- **`limit: 10`**: Controls how many memory results are retrieved and used as context
- **`saveStreamDeltas: true`**: Ensures all conversation parts are saved for future memory retrieval

## Complete Memory Flow Example

Here's how memory works in practice with the streaming implementation:

### Thread Creation
```typescript
export const createThread = mutation({
  args: { prompt: v.string() },
  handler: async (ctx) => {
    const userId = await requireAuth(ctx);
    const { threadId } = await agent.createThread(ctx, { userId });
    return threadId;
  },
});
```

### Message Sending with Memory
```typescript
export const sendMessage = mutation({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    const userId = await requireAuth(ctx);
    await ctx.scheduler.runAfter(0, internal.chat.generateResponse, {
      input: { threadId, userId, prompt },
    });
  },
});
```

### Memory-Enabled Response Generation
```typescript
// Inside generateResponse handler
const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    const result = await thread.streamText(
      { prompt: args.input.prompt },
      {
        saveStreamDeltas: true,      // Save for memory
        contextOptions: {
          searchOptions: {
            vectorSearch: true,      // Search past conversations
            limit: 10,
          },
          searchOtherThreads: true,  // Search all user threads
        },
      },
    );

    writer.merge(result.toUIMessageStream({ originalMessages: [] }));
  },
});
```

### Retrieving Messages with Streams
```typescript
export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, { threadId, paginationOpts, streamArgs }) => {
    await requireAuth(ctx);

    const paginated = await agent.listMessages(ctx, {
      threadId,
      paginationOpts,
    });

    const streams = await agent.syncStreams(ctx, {
      threadId,
      streamArgs,
    });

    return { ...paginated, streams };
  },
});
```

## How Memory Works Automatically

1. **Automatic Storage**: Every message and response is automatically converted to vector embeddings and stored
2. **Contextual Retrieval**: When processing new messages, the system automatically searches for relevant past conversations
3. **Cross-Thread Memory**: The agent can reference information from previous conversation threads
4. **Vector Search**: Uses semantic similarity to find the most relevant historical context
5. **Stream Integration**: Memory works seamlessly with streaming responses

## Memory in Action

When a user sends a message:

1. The `sendMessage` mutation triggers `generateResponse`
2. `generateResponse` creates a streaming response with memory enabled
3. The system converts the question to a vector embedding
4. It searches stored conversation history for semantically similar content
5. The most relevant past conversations (up to limit) are retrieved
6. This context is included when generating the streaming response
7. The new conversation is automatically stored for future memory retrieval

## Key Benefits

- **No Manual Implementation**: Memory works automatically without additional code
- **Semantic Understanding**: Finds relevant context even if different words are used
- **Cross-Session Continuity**: Remembers context across different conversation sessions
- **Scalable**: Efficiently searches large conversation histories
- **Stream Compatible**: Works seamlessly with real-time streaming responses

## Dependencies

The memory functionality relies on:

- `@convex-dev/agent`: Provides the Agent class with built-in memory capabilities
- `@ai-sdk/openai`: Supplies the text embedding model for vector storage
- `ai`: Provides streaming utilities (`createUIMessageStream`, `readUIMessageStream`)
- Convex backend: Handles storage and retrieval of conversation vectors

No additional setup or configuration is required beyond the basic agent initialization with a text embedding model.