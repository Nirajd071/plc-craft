import { useState, useRef, useEffect } from "react";
import { AlertCircle, CheckCircle, Lightbulb, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValidationResult } from "@/pages/Index";

interface RequirementEditorProps {
  value: string;
  onChange: (value: string) => void;
  validation: ValidationResult;
}

const exampleRequirements = [
  "Create a conveyor belt control system with start/stop buttons and emergency stop",
  "Design a traffic light controller for a 4-way intersection with pedestrian crossing",
  "Implement a tank filling system with level sensors and overflow protection",
  "Build a temperature control system for an industrial oven with PID control"
];

export const RequirementEditor = ({ value, onChange, validation }: RequirementEditorProps) => {
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  const handleExampleClick = (example: string) => {
    onChange(example);
    setShowExamples(false);
  };

  const getValidationIcon = () => {
    if (!value.trim()) return null;
    
    if (validation.isValid && validation.confidence > 0.8) {
      return <CheckCircle className="w-4 h-4 text-success" />;
    } else if (validation.issues.some(issue => issue.type === 'error')) {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value + (value ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">System Requirements</h3>
        <div className="flex items-center gap-2">
          {getValidationIcon()}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Examples
          </Button>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your PLC system requirements in natural language...

Example: 'Create a conveyor belt control system with start and stop buttons. Include an emergency stop that immediately halts all operations. Add safety interlocks to prevent operation when maintenance door is open.'"
          className="w-full min-h-[120px] max-h-[300px] p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono leading-relaxed"
        />
        
        {('webkitSpeechRecognition' in window) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startVoiceRecognition}
            disabled={isListening}
            className={`absolute bottom-3 right-3 ${isListening ? 'animate-pulse text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Mic className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showExamples && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Quick Start Examples:</p>
          {exampleRequirements.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-background/80 p-2 rounded transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}

      {validation.issues.length > 0 && (
        <div className="space-y-2">
          {validation.issues.slice(0, 3).map((issue, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                issue.type === 'error' ? 'validation-error' :
                issue.type === 'warning' ? 'validation-warning' :
                'bg-primary-light/10 border border-primary/30'
              }`}
            >
              <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                issue.type === 'error' ? 'text-destructive' :
                issue.type === 'warning' ? 'text-warning' :
                'text-primary'
              }`} />
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};