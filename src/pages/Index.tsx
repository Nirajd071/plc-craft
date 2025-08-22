import { useState } from "react";
import { Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { RequirementEditor } from "@/components/RequirementEditor";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { CodeOutput } from "@/components/CodeOutput";
import { ValidationPanel } from "@/components/ValidationPanel";
import { Card } from "@/components/ui/card";
import industrialHero from "@/assets/industrial-hero.jpg";

export interface PLCConfig {
  complexity: 'auto' | 'simple' | 'medium' | 'complex';
  validationLevel: 'basic' | 'standard' | 'strict';
  codeStyle: 'standard' | 'compact' | 'verbose';
  numVariants: number;
  targetPlatform: 'siemens' | 'allen-bradley' | 'schneider' | 'generic';
}

export interface ValidationResult {
  isValid: boolean;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
  }>;
  confidence: number;
}

export interface CodeVariant {
  id: string;
  title: string;
  code: string;
  confidence: number;
  validation: ValidationResult;
}

const Index = () => {
  const [requirement, setRequirement] = useState("");
  const [config, setConfig] = useState<PLCConfig>({
    complexity: 'auto',
    validationLevel: 'standard',
    codeStyle: 'standard',
    numVariants: 2,
    targetPlatform: 'generic'
  });
  const [codeVariants, setCodeVariants] = useState<CodeVariant[]>([]);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    issues: [],
    confidence: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!requirement.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call with realistic delay
    setTimeout(() => {
      // Mock code generation
      const mockVariants: CodeVariant[] = [
        {
          id: '1',
          title: 'Standard Implementation',
          code: `PROGRAM ConveyorControl
VAR
    StartButton : BOOL;
    StopButton : BOOL;
    ConveyorMotor : BOOL;
    SafetyRelay : BOOL := TRUE;
    EmergencyStop : BOOL;
END_VAR

// Main control logic
IF StartButton AND SafetyRelay AND NOT EmergencyStop THEN
    ConveyorMotor := TRUE;
ELSIF StopButton OR NOT SafetyRelay OR EmergencyStop THEN
    ConveyorMotor := FALSE;
END_IF;

END_PROGRAM`,
          confidence: 0.92,
          validation: {
            isValid: true,
            issues: [],
            confidence: 0.92
          }
        },
        {
          id: '2',
          title: 'Enhanced with Status',
          code: `PROGRAM ConveyorControl
VAR
    StartButton : BOOL;
    StopButton : BOOL;
    ConveyorMotor : BOOL;
    SafetyRelay : BOOL := TRUE;
    EmergencyStop : BOOL;
    SystemRunning : BOOL;
    StatusLED : BOOL;
END_VAR

// Main control logic with status indication
SystemRunning := StartButton AND SafetyRelay AND NOT EmergencyStop;

IF SystemRunning AND NOT StopButton THEN
    ConveyorMotor := TRUE;
    StatusLED := TRUE;
ELSE
    ConveyorMotor := FALSE;
    StatusLED := FALSE;
END_IF;

END_PROGRAM`,
          confidence: 0.88,
          validation: {
            isValid: true,
            issues: [
              {
                type: 'info',
                message: 'Consider adding motor feedback for enhanced monitoring',
                line: 12
              }
            ],
            confidence: 0.88
          }
        }
      ];

      setCodeVariants(mockVariants);
      setValidation({
        isValid: true,
        issues: [],
        confidence: 0.90
      });
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: `url(${industrialHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          {codeVariants.length === 0 && !isGenerating && (
            <div className="text-center py-12 mb-8">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-technical animate-glow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold font-display mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Transform Ideas into Industrial Code
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Describe your automation requirements in natural language and watch as AI generates 
                professional IEC 61131-3 Structured Text code for your PLC systems.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-200px)]">
            {/* Left Panel: Input & Configuration */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="card-technical p-6 backdrop-blur-sm border-primary/20 shadow-xl">
                <RequirementEditor
                  value={requirement}
                  onChange={setRequirement}
                  validation={validation}
                />
              </Card>
              
              <Card className="card-technical p-6 backdrop-blur-sm border-primary/20 shadow-xl">
                <ConfigurationPanel
                  config={config}
                  onChange={setConfig}
                />
              </Card>
              
              <button
                onClick={handleGenerate}
                disabled={!requirement.trim() || isGenerating}
                className="w-full btn-technical px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-display">Generating Code...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 font-display">
                    <Zap className="w-5 h-5" />
                    Generate PLC Code
                  </span>
                )}
              </button>
            </div>

            {/* Right Panel: Output & Validation */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="card-technical p-6 h-full backdrop-blur-sm border-primary/20 shadow-xl">
                <CodeOutput
                  variants={codeVariants}
                  isLoading={isGenerating}
                />
              </Card>
              
              {validation.issues.length > 0 && (
                <Card className="card-technical p-6 backdrop-blur-sm border-primary/20 shadow-xl">
                  <ValidationPanel validation={validation} />
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;