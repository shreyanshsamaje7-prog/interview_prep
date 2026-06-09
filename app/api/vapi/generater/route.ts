
import  {generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin"

export async function GET() {
    return Response.json({ success: true, data: "Hello World" }, { status: 200 })
}

export async function POST(request: Request) {
    const payload = await request.json();

    if (payload.message?.type === 'tool-calls') {
        const toolCall = payload.message.toolWithToolCallList[0].toolCall;
        const toolCallId = toolCall.id;

        const args = toolCall.function.arguments;
        const { type, role, level, amount } = args;
        const techstack = args.techstack;

        const userid = payload.userid || payload.message?.call?.variableValues?.userid || "anonymous";

        try {
            const techstackString = Array.isArray(techstack) ? techstack.join(", ") : techstack;

            // Use generateObject with Zod to STRICTLY force Gemini to return an array of strings
            const { object } = await generateObject({
                model: google("gemini-2.5-flash"),
                schema: z.object({
                    questions: z.array(z.string())
                }),
                prompt: `Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techstackString}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return strictly a JSON object with a 'questions' array containing the generated questions.
                Do not use "/" or "*" or any other special characters which might break the voice assistant.`,
            });

            // Now we don't need JSON.parse() at all! It is guaranteed to be an array.
            const generatedQuestions = object.questions;

            const interview = {
                type,
                role,
                level,
                techstack: Array.isArray(techstack) ? techstack : [techstack],
                questions: generatedQuestions, // Saved correctly as an Array!
                userId: userid,
                finalized: true,
                coverImage: getRandomInterviewCover(),
                createdAt: new Date().toISOString(),
            };

            await db.collection("interviews").add(interview);

            return Response.json({
                results: [
                    {
                        toolCallId: toolCallId,
                        result: `Successfully generated ${amount} questions. The questions are: ${JSON.stringify(generatedQuestions)}. Please start conducting the interview using these exact questions.`
                    }
                ]
            }, { status: 200 });

        } catch (e) {
            console.error("Error generating interview questions:", e);
            return Response.json({
                results: [
                    {
                        toolCallId: toolCallId,
                        error: "Failed to generate questions due to a server error. Please inform the user."
                    }
                ]
            }, { status: 500 });
        }
    }

    return Response.json({ success: false, message: "Invalid VAPI request format" }, { status: 400 });
}