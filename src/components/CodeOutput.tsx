import { useState } from "react";
import { Copy, Download, Eye, GitCompare, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MonacoEditor from "@monaco-editor/react";
import { CodeVariant } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface CodeOutputProps {
  variants: CodeVariant[];
  isLoading: boolean;
}

export const CodeOutput = ({ variants, isLoading }: CodeOutputProps) => {
  const [activeTab, setActiveTab] = useState("0");
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code copied!",
        description: "The code has been copied to your clipboard.",
      });
    });
  };

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started!",
      description: `Downloading ${filename}`,
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-success";
    if (confidence >= 0.7) return "text-warning";
    return "text-destructive";
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return "status-success";
    if (confidence >= 0.7) return "status-warning";
    return "status-error";
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Generated Code</h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-foreground font-medium">Generating PLC Code...</p>
              <p className="text-sm text-muted-foreground">Analyzing requirements and creating optimized solutions</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Generated Code</h3>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">Ready to Generate</p>
              <p className="text-sm text-muted-foreground">Enter your requirements and configure settings to generate PLC code</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Generated Code</h3>
        <div className="flex items-center gap-2">
          {variants.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="text-muted-foreground hover:text-foreground"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1">
        {showComparison && variants.length > 1 ? (
          <div className="grid grid-cols-2 gap-4 h-full">
            {variants.slice(0, 2).map((variant, index) => (
              <div key={variant.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground">{variant.title}</h4>
                    <Badge className={`text-xs ${getConfidenceBadge(variant.confidence)}`}>
                      {Math.round(variant.confidence * 100)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(variant.code)}
                      className="p-1 h-auto"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(variant.code, `${variant.title.replace(/\s+/g, '_')}.st`)}
                      className="p-1 h-auto"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="w-full h-96 border border-border rounded-lg overflow-hidden bg-slate-900">
                  <MonacoEditor
                    height="384px"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={variant.code}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible'
                      },
                      renderLineHighlight: 'none',
                      contextmenu: false
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                {variants.map((variant, index) => (
                  <TabsTrigger key={variant.id} value={index.toString()} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span>{variant.title}</span>
                      <Badge className={`text-xs ${getConfidenceBadge(variant.confidence)}`}>
                        {Math.round(variant.confidence * 100)}%
                      </Badge>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(variants[parseInt(activeTab)]?.code || '')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const variant = variants[parseInt(activeTab)];
                    if (variant) {
                      handleDownload(variant.code, `${variant.title.replace(/\s+/g, '_')}.st`);
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {variants.map((variant, index) => (
              <TabsContent key={variant.id} value={index.toString()} className="mt-0">
                <div className="space-y-4">
                  {/* Variant Info */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {variant.validation.isValid ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        )}
                        <span className="text-sm font-medium text-foreground">{variant.title}</span>
                      </div>
                      <Badge className={`text-xs ${getConfidenceBadge(variant.confidence)}`}>
                        Confidence: {Math.round(variant.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    {variant.validation.issues.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {variant.validation.issues.length} issue{variant.validation.issues.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {/* Code Editor */}
                  <div className="w-full h-96 border border-border rounded-lg overflow-hidden bg-slate-900">
                    <MonacoEditor
                      height="384px"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={variant.code}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollbar: {
                          vertical: 'visible',
                          horizontal: 'visible'
                        },
                        renderLineHighlight: 'none',
                        contextmenu: false
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};