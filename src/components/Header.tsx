import { Sparkles, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminRole } from "@/hooks/useAdminRole";
import logo from "@/assets/logo.svg";

interface HeaderProps {
  credits: number;
  isPro: boolean;
  onUpgrade: () => void;
}

const Header = ({ credits, isPro, onUpgrade }: HeaderProps) => {
  const { isAdmin } = useAdminRole();
  
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <img src={logo} alt="NAVYK" className="h-8 w-8" />
          <span className="text-xl font-bold gradient-text">NAVYK</span>
          {isAdmin && (
            <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-primary/20">
              <Shield className="h-3 w-3 mr-1" />
              Админ
            </Badge>
          )}
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
