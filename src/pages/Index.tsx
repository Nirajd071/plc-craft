import { useState } from "react";
import { Header } from "@/components/Header";
import { RequirementEditor } from "@/components/RequirementEditor";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { CodeOutput } from "@/components/CodeOutput";
import { ValidationPanel } from "@/components/ValidationPanel";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel: Input & Configuration */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="card-technical p-6">
              <RequirementEditor
                value={requirement}
                onChange={setRequirement}
                validation={validation}
              />
            </Card>
            
            <Card className="card-technical p-6">
              <ConfigurationPanel
                config={config}
                onChange={setConfig}
              />
            </Card>
            
            <button
              onClick={handleGenerate}
              disabled={!requirement.trim() || isGenerating}
              className="w-full btn-technical px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Code...
                </span>
              ) : (
                'Generate PLC Code'
              )}
            </button>
          </div>

          {/* Right Panel: Output & Validation */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="card-technical p-6 h-full">
              <CodeOutput
                variants={codeVariants}
                isLoading={isGenerating}
              />
            </Card>
            
            {validation.issues.length > 0 && (
              <Card className="card-technical p-6">
                <ValidationPanel validation={validation} />
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;