"use client";

import { useState } from "react";
import { generateAffiliateCode } from "@/actions/affiliate.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AffiliateCodeDisplayProps {
  initialCode: string | null;
}

export function AffiliateCodeDisplay({
  initialCode,
}: AffiliateCodeDisplayProps) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    try {
      const result = await generateAffiliateCode();
      if (result.success && result.code) {
        setCode(result.code);
        toast.success(result.message || "Code generated successfully!");
      } else {
        // Handle cases where code already exists or other errors
        toast.error(result.error || "Failed to generate code.");
        if (result.code) {
          // If error was 'already exists', update state anyway
          setCode(result.code);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred during code generation.");
      console.error("Generate code error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          toast.success("Code copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy code.");
          console.error("Failed to copy text: ", err);
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Affiliate Code</CardTitle>
        <CardDescription>
          Share this code with others. You will earn a commission on qualifying
          purchases made using your code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {code ? (
          <div className="flex items-center space-x-2">
            <Input
              value={code}
              readOnly
              className="font-mono text-lg"
              data-testid="affiliate-code-input" // Added data-testid
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyToClipboard}
              title="Copy to clipboard"
              data-testid="copy-code-button" // Added data-testid
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start space-y-2">
            <p className="text-muted-foreground">
              You do not have an affiliate code yet.
            </p>
            <Button
              onClick={handleGenerateCode}
              disabled={isLoading}
              data-testid="generate-code-button" // Added data-testid
            >
              {isLoading ? "Generating..." : "Generate Code"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
