import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorPanelProps {
  language: string;
  code: string;
  setCode: (val: string) => void;
}

const CodeEditor: React.FC<CodeEditorPanelProps> = ({ language, code, setCode }) => (
  <Editor
    height="calc(100vh - 200px)"
    language={language}
    theme="vs-dark"
    value={code}
    onChange={(val) => setCode(val || "")}
    options={{
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true,
    }}
  />
);

export default CodeEditor;
