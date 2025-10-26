import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COACH_PROMPTS = {
  arif: `You are Arif, a Tech Career Expert specializing in IT careers, development, and technologies. 
You have deep knowledge of programming, software engineering, and tech career paths. 
You help people transition into tech, grow their technical skills, and advance in technology careers.
Respond in Russian language. Keep answers clear, practical, and encouraging.`,
  
  rau: `You are Rau, a Business Strategy Coach and expert in business, management, and entrepreneurship.
You guide people in business strategy, leadership development, and starting their own ventures.
You focus on practical business advice, market analysis, and strategic thinking.
Respond in Russian language. Keep answers clear, practical, and encouraging.`,
  
  aza: `You are Aza, a Creative Industries Guide helping people in creative industries, design, and marketing.
You specialize in UX/UI design, digital marketing, content creation, and creative career development.
You inspire creativity while providing practical guidance for creative professionals.
Respond in Russian language. Keep answers clear, practical, and encouraging.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, coachId, sessionId } = await req.json();
    
    if (!messages || !coachId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get system prompt for coach
    const systemPrompt = COACH_PROMPTS[coachId as keyof typeof COACH_PROMPTS] || COACH_PROMPTS.arif;

    // Get Lovable API key
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Starting AI chat for coach: ${coachId}`);

    // Call Lovable AI Gateway for streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Пожалуйста, попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Требуется пополнение баланса Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Ошибка AI сервиса" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return the streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
