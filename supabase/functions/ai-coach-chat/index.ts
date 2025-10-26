import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COACH_PROMPTS = {
  arif: `Ты Ариф 🚀 - карьерный наставник для зумеров!

СТИЛЬ ОБЩЕНИЯ:
- Пиши КОРОТКИМИ сообщениями (1-3 предложения)
- Используй эмодзи 😎💪🔥
- Будь дружелюбным и неформальным
- Мотивируй действовать СЕЙЧАС

ТВОИ ВОЗМОЖНОСТИ:
- Находить вакансии на платформе
- Рекомендовать менторов
- Советовать задания для XP и достижений

ВАЖНО: После каждого совета предлагай КОНКРЕТНОЕ действие с геймификацией! 🎯`,
  
  rau: `Ты Рау 📝 - гуру резюме и собесов!

СТИЛЬ:
- КОРОТКИЕ советы (макс 2-3 строки)
- Много эмодзи ✨💼
- Практично и по делу
- Мотивируй быстро действовать

ФИШКИ:
- Находишь подходящие вакансии
- Рекомендуешь менторов для подготовки
- Даешь квесты для прокачки

НЕ ЗАБЫВАЙ: После каждого ответа - предложи задание для XP! 🎮`,
  
  aza: `Ты Аза 🌟 - эксперт по soft skills!

СТИЛЬ:
- Короткие послания (1-2 фразы)
- Эмодзи в каждом сообщении 💫✨
- Поддержка и мотивация
- Зажигай на действия

ЧТО УМЕЕШЬ:
- Подбираешь менторов
- Советуешь вакансии
- Даешь челленджи для роста

ГЛАВНОЕ: Всегда предлагай квест или достижение! 🏆`
};

// Tool definitions
const tools = [
  {
    type: "function",
    function: {
      name: "search_jobs",
      description: "Найти вакансии на платформе NAVYK",
      parameters: {
        type: "object",
        properties: {
          skills: {
            type: "string",
            description: "Навыки или ключевые слова для поиска"
          },
          limit: {
            type: "number",
            description: "Количество вакансий (по умолчанию 3)"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_mentors",
      description: "Найти менторов на платформе NAVYK",
      parameters: {
        type: "object",
        properties: {
          expertise: {
            type: "string",
            description: "Область экспертизы"
          },
          limit: {
            type: "number",
            description: "Количество менторов (по умолчанию 2)"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_gamification_actions",
      description: "Получить доступные квесты и достижения для геймификации",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  }
];

// Tool execution functions
async function searchJobs(supabase: any, skills?: string, limit = 3) {
  let query = supabase
    .from('jobs')
    .select('id, title, company, location, salary_min, salary_max, job_type, tags, requirements')
    .limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data || [];
}

async function searchMentors(supabase: any, expertise?: string, limit = 2) {
  let query = supabase
    .from('mentors')
    .select(`
      id,
      role_title,
      company,
      experience_years,
      rate_per_hour,
      expertise,
      rating,
      profiles!inner(full_name)
    `)
    .eq('is_available', true)
    .limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }

  return (data || []).map((m: any) => ({
    ...m,
    mentor_name: m.profiles?.full_name
  }));
}

async function getGamificationActions(supabase: any) {
  const [questsResult, achievementsResult] = await Promise.all([
    supabase.from('daily_quests').select('name, description, xp_reward, quest_type').limit(5),
    supabase.from('achievements').select('name, description, xp_reward, category').limit(5)
  ]);

  return {
    quests: questsResult.data || [],
    achievements: achievementsResult.data || []
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { messages, coachId } = await req.json();
    
    if (!messages || !coachId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = COACH_PROMPTS[coachId as keyof typeof COACH_PROMPTS] || COACH_PROMPTS.arif;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`AI chat for coach: ${coachId}`);

    // First call - check if AI wants to use tools
    let aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const initialResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: aiMessages,
        tools: tools,
        tool_choice: 'auto',
      }),
    });

    if (!initialResponse.ok) {
      if (initialResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Попробуй через минуту! 😊" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (initialResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Требуется пополнение баланса 💰" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await initialResponse.text();
      console.error('AI gateway error:', initialResponse.status, errorText);
      throw new Error('AI gateway error');
    }

    const initialData = await initialResponse.json();
    const choice = initialData.choices[0];

    // Check if AI wants to use tools
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      console.log('AI requested tools:', choice.message.tool_calls);
      
      // Execute all tool calls
      const toolResults = await Promise.all(
        choice.message.tool_calls.map(async (toolCall: any) => {
          const functionName = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments);
          
          console.log(`Executing tool: ${functionName}`, args);
          
          let result;
          try {
            switch (functionName) {
              case 'search_jobs':
                result = await searchJobs(supabase, args.skills, args.limit);
                break;
              case 'search_mentors':
                result = await searchMentors(supabase, args.expertise, args.limit);
                break;
              case 'get_gamification_actions':
                result = await getGamificationActions(supabase);
                break;
              default:
                result = { error: 'Unknown function' };
            }
          } catch (error) {
            console.error(`Error executing ${functionName}:`, error);
            result = { error: 'Function execution failed' };
          }
          
          return {
            tool_call_id: toolCall.id,
            role: 'tool',
            name: functionName,
            content: JSON.stringify(result)
          };
        })
      );

      // Add assistant message and tool results to conversation
      aiMessages.push(choice.message);
      aiMessages.push(...toolResults);

      // Second call with tool results - stream the response
      const finalResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: aiMessages,
          stream: true,
        }),
      });

      if (!finalResponse.ok) {
        throw new Error('AI gateway error on final response');
      }

      return new Response(finalResponse.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // No tools needed - stream the initial response
    const streamResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!streamResponse.ok) {
      throw new Error('AI gateway error');
    }

    return new Response(streamResponse.body, {
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
