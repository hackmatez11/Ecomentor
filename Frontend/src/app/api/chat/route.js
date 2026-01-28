import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Supabase Admin Client (to fetch user data securely)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    // Note: For read-only access to user stats, anon key is often fine if RLS policies allow reading.
    // If we need to bypass RLS, we'd need a SERVICE_ROLE_KEY, but let's stick to standard flow for now using passed user ID.
);

export async function POST(req) {
    try {
        const { message, history, userId } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        // 1. Fetch Student Context
        let studentContext = "The user is a student on EcoMentor.";

        if (userId) {
            // Fetch profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, role")
                .eq("id", userId)
                .single();

            // Fetch details
            const { data: details } = await supabase
                .from("user_details")
                .select("education_level, institution")
                .eq("user_id", userId)
                .single();

            // Fetch stats (mocked table structure based on schema logic or assuming 'students' table is populated)
            const { data: stats } = await supabase
                .from("students")
                .select("eco_points, completed_tasks")
                .eq("id", userId)
                .single();

            if (profile) {
                studentContext += ` Name: ${profile.full_name}. Role: ${profile.role}.`;
            }
            if (details) {
                studentContext += ` Education Level: ${details.education_level}. Institution: ${details.institution}.`;
            }
            if (stats) {
                studentContext += ` Current EcoPoints: ${stats.eco_points}. Completed Tasks: ${stats.completed_tasks}.`;
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const chat = model.startChat({
            history: history || [],
            systemInstruction: `
        You are EcoBot, a friendly and motivating AI assistant for the EcoMentor platform.
        
        Your Goal: Help students learn about sustainability, track their progress, and stay motivated.
        
        Student Context:
        ${studentContext}
        
        Guidelines:
        1. tailored to their education level (Simple for school, detailed for college).
        2. If they ask about their points or progress, use the provided context.
        3. Keep responses concise (max 2-3 sentences unless asked for an explanation).
        4. Use emojis occasionally to be friendly 🌱.
        5. Encourage real-world eco-actions.
        
        If you don't know something specific (like live worldwide stats), say so, but offer general info.
      `,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Failed to process chat" },
            { status: 500 }
        );
    }
}
