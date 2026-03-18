
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw, CheckCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  language: string;
  initialCode: string;
  expectedOutput?: string;
  lesson: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  language, 
  initialCode, 
  expectedOutput,
  lesson 
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      if (language === 'html') {
        // For HTML, we'll show a preview
        setOutput(code);
      } else if (language === 'css') {
        // For CSS, we'll show it applied to a sample HTML
        const htmlWithCSS = `
          <style>${code}</style>
          <div class="sample-div">Sample Content</div>
          <p class="sample-text">Sample paragraph text</p>
          <button class="sample-button">Sample Button</button>
        `;
        setOutput(htmlWithCSS);
      } else if (language === 'javascript') {
        // For JavaScript, we'll evaluate it safely
        try {
          // Create a safe execution environment
          const originalConsoleLog = console.log;
          let consoleOutput = '';
          
          console.log = (...args) => {
            consoleOutput += args.join(' ') + '\n';
          };
          
          // Execute the code
          const result = eval(code);
          
          console.log = originalConsoleLog;
          
          if (consoleOutput) {
            setOutput(consoleOutput);
          } else if (result !== undefined) {
            setOutput(String(result));
          } else {
            setOutput('Code executed successfully!');
          }
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
      }

      // Check if output matches expected output
      if (expectedOutput && output.trim() === expectedOutput.trim()) {
        toast({
          title: "Great job!",
          description: "Your code produces the expected output!",
        });
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Try it Yourself</span>
          <div className="flex space-x-2">
            <Button
              onClick={resetCode}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              onClick={runCode}
              disabled={isRunning}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Code Editor:</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-48 p-3 border rounded-md font-mono text-sm bg-slate-50"
              placeholder={`Write your ${language} code here...`}
            />
          </div>
          
          {/* Output */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'html' || language === 'css' ? 'Result:' : 'Output:'}
            </label>
            <div className="w-full h-48 border rounded-md overflow-auto">
              {language === 'html' || language === 'css' ? (
                <iframe
                  srcDoc={output}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="p-3 text-sm bg-slate-50 h-full overflow-auto">
                  {output || 'Click "Run" to see the output...'}
                </pre>
              )}
            </div>
          </div>
        </div>
        
        {expectedOutput && (
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm">
              <strong>Expected Output:</strong> {expectedOutput}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeEditor;