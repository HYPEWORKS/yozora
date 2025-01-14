import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";

export default function Json() {
  const [json, setJson] = useState<string>("{}");

  const prettify = useCallback(() => {
    setJson(JSON.stringify(JSON.parse(json), null, 2));
  }, [json]);

  const minify = useCallback(() => {
    setJson(JSON.stringify(JSON.parse(json)));
  }, [json]);

  // TODO: fix the height of the editor being wacky

  return (
    <div className="flex flex-col max-h-fit">
      <div className="flex justify-between items-center">
        <Button className="mb-3" onClick={prettify}>Prettify</Button>
        <Button className="mb-3" onClick={minify}>Minify</Button>
      </div>
      <div className="flex-grow">
        <Editor
          language="json"
          theme="vs-dark"
          height="85svh"
          options={{
            automaticLayout: true,
            scrollBeyondLastLine: true,
            wordWrap: "on", 
          }}
          value={json}
          onChange={(value) => {
            if (!value || value === json) {
              return;
            }

            setJson(value);
          }}
        />
      </div>
    </div>
  );
}
