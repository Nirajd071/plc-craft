import { HelpCircle, Cpu, Shield, Code, Layers, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PLCConfig } from "@/pages/Index";

interface ConfigurationPanelProps {
  config: PLCConfig;
  onChange: (config: PLCConfig) => void;
}

export const ConfigurationPanel = ({ config, onChange }: ConfigurationPanelProps) => {
  const updateConfig = (key: keyof PLCConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const complexityOptions = [
    { value: 'auto', label: 'Auto-Detect', icon: Settings2, description: 'Let AI determine complexity' },
    { value: 'simple', label: 'Simple', icon: Layers, description: 'Basic logic, minimal features' },
    { value: 'medium', label: 'Medium', icon: Cpu, description: 'Standard industrial features' },
    { value: 'complex', label: 'Complex', icon: Shield, description: 'Advanced safety & monitoring' }
  ];

  const validationOptions = [
    { value: 'basic', label: 'Basic', description: 'Syntax validation only' },
    { value: 'standard', label: 'Standard', description: 'Safety & best practices' },
    { value: 'strict', label: 'Strict', description: 'Full IEC 61131-3 compliance' }
  ];

  const styleOptions = [
    { value: 'standard', label: 'Standard', description: 'Balanced readability & size' },
    { value: 'compact', label: 'Compact', description: 'Minimal code footprint' },
    { value: 'verbose', label: 'Verbose', description: 'Maximum documentation' }
  ];

  const platformOptions = [
    { value: 'generic', label: 'Generic IEC 61131-3' },
    { value: 'siemens', label: 'Siemens TIA Portal' },
    { value: 'allen-bradley', label: 'Allen-Bradley Studio 5000' },
    { value: 'schneider', label: 'Schneider Unity Pro' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Generation Settings</h3>
      </div>

      <div className="space-y-5">
        {/* Complexity Level */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Complexity Level</label>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <HelpCircle className="w-3 h-3 text-muted-foreground" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {complexityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => updateConfig('complexity', option.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    config.complexity === option.value
                      ? 'border-primary bg-primary-light/10 text-primary'
                      : 'border-border bg-background hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Level */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Validation Level</label>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <HelpCircle className="w-3 h-3 text-muted-foreground" />
            </Button>
          </div>
          <Select value={config.validationLevel} onValueChange={(value: any) => updateConfig('validationLevel', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {validationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Code Style */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Code Style</label>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <HelpCircle className="w-3 h-3 text-muted-foreground" />
            </Button>
          </div>
          <Select value={config.codeStyle} onValueChange={(value: any) => updateConfig('codeStyle', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Number of Variants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Code Variants</label>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </Button>
            </div>
            <span className="text-sm font-medium text-primary">{config.numVariants}</span>
          </div>
          <Slider
            value={[config.numVariants]}
            onValueChange={([value]) => updateConfig('numVariants', value)}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 (Faster)</span>
            <span>5 (More Options)</span>
          </div>
        </div>

        {/* Target Platform */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Target Platform</label>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <HelpCircle className="w-3 h-3 text-muted-foreground" />
            </Button>
          </div>
          <Select value={config.targetPlatform} onValueChange={(value: any) => updateConfig('targetPlatform', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Est. Generation Time</p>
            <p className="text-sm font-medium text-foreground">
              {config.numVariants * 0.8 + (config.complexity === 'complex' ? 1 : 0.5)}s
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Validation Depth</p>
            <p className="text-sm font-medium text-foreground">
              {config.validationLevel === 'strict' ? 'Deep' : config.validationLevel === 'standard' ? 'Standard' : 'Basic'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};