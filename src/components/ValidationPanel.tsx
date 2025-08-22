import { AlertCircle, CheckCircle, Info, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ValidationResult } from "@/pages/Index";

interface ValidationPanelProps {
  validation: ValidationResult;
}

export const ValidationPanel = ({ validation }: ValidationPanelProps) => {
  const getIssueIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info':
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getIssueClass = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'validation-error';
      case 'warning':
        return 'validation-warning';
      case 'info':
        return 'bg-primary-light/10 border border-primary/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-success";
    if (confidence >= 0.7) return "text-warning";
    return "text-destructive";
  };

  const getConfidenceMessage = (confidence: number) => {
    if (confidence >= 0.95) return "Excellent - Ready for production";
    if (confidence >= 0.85) return "Very Good - Minor review recommended";
    if (confidence >= 0.7) return "Good - Review suggested";
    if (confidence >= 0.5) return "Fair - Significant review needed";
    return "Poor - Major revision required";
  };

  const errorCount = validation.issues.filter(issue => issue.type === 'error').length;
  const warningCount = validation.issues.filter(issue => issue.type === 'warning').length;
  const infoCount = validation.issues.filter(issue => issue.type === 'info').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <CheckCircle className="w-5 h-5 text-success" />
          ) : (
            <AlertCircle className="w-5 h-5 text-destructive" />
          )}
          <h3 className="text-lg font-semibold text-foreground">Validation Results</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {errorCount} Error{errorCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge className="bg-warning text-warning-foreground text-xs">
              {warningCount} Warning{warningCount !== 1 ? 's' : ''}
            </Badge>
          )}
          {infoCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {infoCount} Info
            </Badge>
          )}
        </div>
      </div>

      {/* Confidence Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Overall Confidence</span>
          </div>
          <span className={`text-sm font-medium ${getConfidenceColor(validation.confidence)}`}>
            {Math.round(validation.confidence * 100)}%
          </span>
        </div>
        
        <Progress 
          value={validation.confidence * 100} 
          className="h-2"
        />
        
        <p className="text-xs text-muted-foreground">
          {getConfidenceMessage(validation.confidence)}
        </p>
      </div>

      {/* Issues List */}
      {validation.issues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Issues & Suggestions</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {validation.issues.map((issue, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm flex items-start gap-3 ${getIssueClass(issue.type)}`}
              >
                {getIssueIcon(issue.type)}
                <div className="flex-1 space-y-1">
                  <p className="leading-relaxed">{issue.message}</p>
                  {issue.line && (
                    <p className="text-xs opacity-75">Line {issue.line}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {validation.isValid && validation.issues.length === 0 && (
        <div className="status-success p-4 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="font-medium text-success">Code validation passed!</p>
          <p className="text-sm text-success/80 mt-1">
            Your generated code meets all validation criteria and is ready for implementation.
          </p>
        </div>
      )}

      {/* Quality Metrics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Safety</p>
          <p className="text-sm font-medium text-foreground">
            {errorCount === 0 ? 'Pass' : 'Review'}
          </p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Standards</p>
          <p className="text-sm font-medium text-foreground">
            {validation.confidence >= 0.8 ? 'Compliant' : 'Partial'}
          </p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">Optimization</p>
          <p className="text-sm font-medium text-foreground">
            {validation.confidence >= 0.9 ? 'Optimal' : 'Good'}
          </p>
        </div>
      </div>
    </div>
  );
};