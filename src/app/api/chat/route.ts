import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

// const rateLimit = new Ratelimit({
//   redis: kv,
//   limiter: Ratelimit.slidingWindow(8, "1h"),
// });

// export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";

    // const { remaining } = await rateLimit.limit(ip);

    // if (remaining === 0) {
    //   return Response.json({ error: "limit exceed" }, { status: 429 });
    // }

    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    //console.log("Relevant notes found: ", relevantNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
