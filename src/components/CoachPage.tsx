import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CoachPage = () => {
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: "Отличный вопрос! Давайте разберем это вместе. На основе ваших навыков и интересов, я рекомендую рассмотреть...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  if (!selectedCoach) {
    return (
      <div className="space-y-4 pb-20">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">AI Career Coach</h1>
          <p className="text-muted-foreground">
            Выберите AI-наставника, который поможет вам в карьерном развитии
          </p>
        </div>

        <div className="space-y-3">
          {coaches.map((coach) => (
            <Card 
              key={coach.id}
              className="cursor-pointer hover:shadow-md transition-base border-border/50"
              onClick={() => setSelectedCoach(coach.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${coach.color} text-4xl p-4 rounded-2xl`}>
                    {coach.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{coach.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                    <CardDescription className="text-sm font-medium text-primary mb-2">
                      {coach.role}
                    </CardDescription>
                    <CardDescription>
                      {coach.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Как работает AI Coach?</h3>
                <p className="text-sm text-muted-foreground">
                  Каждый наставник использует AI для анализа ваших навыков, опыта и целей, 
                  предлагая персонализированные советы по карьерному развитию.
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
      <div className="border-b border-border p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedCoach(null);
                setMessages([]);
              }}
            >
              ← Назад
            </Button>
            <div className="flex items-center gap-2">
              <div className={`bg-gradient-to-br ${currentCoach?.color} text-2xl p-2 rounded-xl`}>
                {currentCoach?.avatar}
              </div>
              <div>
                <div className="font-semibold">{currentCoach?.name}</div>
                <div className="text-xs text-muted-foreground">{currentCoach?.role}</div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Bot className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className={`bg-gradient-to-br ${currentCoach?.color} text-5xl inline-block p-6 rounded-3xl mb-4`}>
              {currentCoach?.avatar}
            </div>
            <h3 className="font-bold text-lg mb-2">
              Привет! Я {currentCoach?.name}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {currentCoach?.description}. Расскажите мне о ваших целях и я помогу вам составить план карьерного развития.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <Avatar className={`h-8 w-8 flex items-center justify-center ${
              message.role === "user" 
                ? "bg-primary text-white" 
                : `bg-gradient-to-br ${currentCoach?.color} text-2xl`
            }`}>
              {message.role === "user" ? "👤" : currentCoach?.avatar}
            </Avatar>
            <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
              <div className={`inline-block p-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-primary text-white"
                  : "bg-secondary"
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Напишите ваш вопрос..."
            className="resize-none min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="bg-gradient-primary hover:opacity-90 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachPage;
