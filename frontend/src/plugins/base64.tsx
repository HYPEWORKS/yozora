import { useState, useCallback } from "react";

import { CallPlugin } from "../../wailsjs/go/main/App";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Base64() {
  // the value of the input field
  type Operation = "encode" | "decode";
  const [operation, setOperation] = useState<Operation>("encode");
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  // Sm9zaA==

  const onSubmit = useCallback(() => {
    CallPlugin("base64", operation, [text]).then((result) => {
      setOutput(result);
    })
  }, [operation, text]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl">Base64 Encoder and Decoder</h1>
      <RadioGroup
        name="base64-operation"
        defaultValue="encode"
        onValueChange={(value) => setOperation(value as Operation)}
        value={operation}
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

      <Input value={text} onChange={e => setText(e.target.value)} />
      <Input value={output} readOnly />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
