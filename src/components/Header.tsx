import { Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  credits: number;
  isPro: boolean;
  onUpgrade: () => void;
}

const Header = ({ credits, isPro, onUpgrade }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-primary rounded-lg p-2">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">NAVYK</span>
        </div>
        
        <div className="flex items-center gap-3">
          {!isPro && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{credits}</span>
              <span className="text-xs text-muted-foreground">кредитов</span>
            </div>
          )}
          
          {isPro ? (
            <div className="px-3 py-1.5 bg-gradient-accent rounded-full">
              <span className="text-sm font-bold text-white">PRO</span>
            </div>
          ) : (
            <Button 
              onClick={onUpgrade}
              size="sm"
              className="bg-gradient-primary hover:opacity-90 text-white font-semibold"
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
