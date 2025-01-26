import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Editor, useMonaco } from "@monaco-editor/react";
import { Braces, DatabaseZap, Minimize2 } from "lucide-react";

export default function Json() {
  const [json, setJson] = useState<string>("{}");

  const prettify = useCallback(() => {
    setJson(JSON.stringify(JSON.parse(json), null, 2));
  }, [json]);

  const minify = useCallback(() => {
    setJson(JSON.stringify(JSON.parse(json)));
  }, [json]);

  const monaco = useMonaco();

  useEffect(() => {
    // TODO: fix bug where closing the command palette doesn't focus back on the editor
    if (monaco) {
      monaco.editor.addKeybindingRule({
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
        command: undefined, // don't propagate, so that we can use the command palette
      });
    }
  }, [monaco]);

  // TODO: make tabs/spaces and tab size configurable

  return (
    <div className="flex flex-col max-h-fit">
      <div className="flex justify-between items-center">
        <Button className="mb-3" onClick={prettify}>
          <Braces />
          Prettify
        </Button>
        <Button className="mb-3" onClick={minify}>
          <Minimize2 />
          Minify
        </Button>
        <Button className="mb-3" onClick={() => {}} disabled>
          <DatabaseZap />
          Query
        </Button>
      </div>
      <div className="flex-grow" style={{ height: "calc(100vh - 180px)" }}>
        <Editor
          language="json"
          theme="vs-dark"
          options={{
            automaticLayout: true,
            scrollBeyondLastLine: true,
            wordWrap: "on",
            insertSpaces: true,
            tabSize: 2,
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
