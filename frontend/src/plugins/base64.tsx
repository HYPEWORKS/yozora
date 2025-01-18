import { useState, useCallback } from "react";
import { CallPlugin } from "../../wailsjs/go/main/App";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Base64() {
  type Operation = "encode" | "decode";
  const [operation, setOperation] = useState<Operation>("encode");
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const { toast } = useToast();

  const onSubmit = useCallback(() => {
    CallPlugin("base64", operation, [text]).then((result) => {
      setOutput(result);
    });
  }, [operation, text]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output).then(() => {
      toast({
        title: "Copied!",
        description: "The output has been copied to your clipboard.",
        duration: 2000,
      })
    }).catch((err) => {
      console.error('Failed to copy text: ', err)
      toast({
        title: "Copy failed",
        description: "There was an error copying the text. Please try again.",
        variant: "destructive",
        duration: 2000,
      })
    })
  }, [output, toast])

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Base64 Encoder and Decoder
          </CardTitle>
          <CardDescription className="text-center">
            Easily encode or decode your text using Base64
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            name="base64-operation"
            defaultValue="encode"
            onValueChange={(value) => setOperation(value as Operation)}
            value={operation}
            className="flex justify-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="encode" id="encode" />
              <Label htmlFor="encode">Encode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="decode" id="decode" />
              <Label htmlFor="decode">Decode</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Textarea
              id="input"
              placeholder={
                operation === "encode"
                  ? "Enter text to encode"
                  : "Enter Base64 to decode"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="output">Output</Label>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleCopy}
                disabled={!output}
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            <Textarea
              id="output"
              value={output}
              readOnly
              className="min-h-[100px] bg-muted"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onSubmit} className="w-full">
            {operation === "encode" ? "Encode" : "Decode"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
