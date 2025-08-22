import { Settings, Zap, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/plc-craft-logo.png";

export const Header = () => {
  return (
    <header className="relative border-b border-border bg-gradient-to-r from-background via-background to-primary/5 shadow-lg overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 grid-pattern"></div>
      
      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src={logoImage} 
                alt="PLC Craft Logo" 
                className="w-12 h-12 rounded-xl shadow-technical"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">
                PLC <span className="text-primary">Craft</span>
              </h1>
              <p className="text-sm text-muted-foreground font-medium">AI-Powered Industrial Code Generation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all">
              <FileText className="w-4 h-4 mr-2" />
              Examples
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};