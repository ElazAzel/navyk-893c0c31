import { useState, useEffect, useRef } from "react";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAIChat } from "@/hooks/useAIChat";

const CoachPage = () => {
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, isLoadingHistory, sendMessage, clearMessages } = useAIChat(selectedCoach || "arif");

  const coaches = [
    {
      id: "arif",
      name: "Arif",
      role: "Tech Career Expert",
      description: "Специализируется на IT-карьерах, разработке и технологиях",
      avatar: "🚀",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "rau",
      name: "Rau",
      role: "Business Strategy Coach",
      description: "Эксперт в бизнесе, менеджменте и предпринимательстве",
      avatar: "💼",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "aza",
      name: "Aza",
      role: "Creative Industries Guide",
      description: "Помогает в креативных индустриях, дизайне и маркетинге",
      avatar: "🎨",
      color: "from-orange-500 to-red-500"
    }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input;
    setInput("");
    await sendMessage(messageText);
  };

  if (!selectedCoach) {
    return (
      <div className="space-y-3 pb-20 px-1">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold">AI Career Coach</h1>
          <p className="text-sm text-muted-foreground">
            Выберите AI-наставника для карьерного развития
          </p>
        </div>

        <div className="space-y-2">
          {coaches.map((coach) => (
            <Card 
              key={coach.id}
              className="cursor-pointer hover:shadow-md transition-base border-border/50"
              onClick={() => setSelectedCoach(coach.id)}
            >
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className={`bg-gradient-to-br ${coach.color} text-2xl sm:text-4xl p-2 sm:p-4 rounded-xl sm:rounded-2xl shrink-0`}>
                    {coach.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <CardTitle className="text-base sm:text-lg">{coach.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm font-medium text-primary mb-1">
                      {coach.role}
                    </CardDescription>
                    <CardDescription className="text-xs sm:text-sm">
                      {coach.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="pt-4 p-4 sm:pt-6 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Как работает AI Coach?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Каждый наставник использует AI для анализа ваших навыков и предлагает персонализированные советы.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCoach = coaches.find(c => c.id === selectedCoach);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] pb-16">
      {/* Chat Header */}
      <div className="border-b border-border p-2 sm:p-4 bg-card">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="shrink-0 px-2"
              onClick={() => {
                setSelectedCoach(null);
                clearMessages();
              }}
            >
              ←
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <div className={`bg-gradient-to-br ${currentCoach?.color} text-xl sm:text-2xl p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0`}>
                {currentCoach?.avatar}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm sm:text-base truncate">{currentCoach?.name}</div>
                <div className="text-xs text-muted-foreground truncate">{currentCoach?.role}</div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">
            <Bot className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Online</span>
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {isLoadingHistory ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Загрузка истории...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className={`bg-gradient-to-br ${currentCoach?.color} text-3xl sm:text-5xl inline-block p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-3 sm:mb-4`}>
              {currentCoach?.avatar}
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-2">
              Привет! Я {currentCoach?.name}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
              {currentCoach?.description}. Расскажите мне о ваших целях и я помогу составить план развития.
            </p>
          </div>
        ) : null}

        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <Avatar className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center shrink-0 ${
              message.role === "user" 
                ? "bg-primary text-white text-sm" 
                : `bg-gradient-to-br ${currentCoach?.color} text-lg sm:text-2xl`
            }`}>
              {message.role === "user" ? "👤" : currentCoach?.avatar}
            </Avatar>
            <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-secondary"
              }`}>
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 sm:gap-3">
            <Avatar className={`h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center bg-gradient-to-br ${currentCoach?.color} text-lg sm:text-2xl shrink-0`}>
              {currentCoach?.avatar}
            </Avatar>
            <div className="flex-1">
              <div className="inline-block p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-secondary">
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-2 sm:p-4 bg-card">
        <div className="flex gap-1.5 sm:gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ваш вопрос..."
            className="resize-none min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] text-sm"
            rows={1}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-gradient-primary hover:opacity-90 shrink-0 h-[40px] w-[40px] sm:h-10 sm:w-10"
          >
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
