import { useEffect, useState } from "react";
import logo from "./assets/images/logo-universal.png";
import { Greet, OnAppStarted } from "../wailsjs/go/main/App";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function App() {
  const [resultText, setResultText] = useState(
    "Please enter your name below 👇"
  );
  const [name, setName] = useState("");
  const updateName = (e: any) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  useEffect(() => {
    setTimeout(() => {
      // yes, this is async but we don't care about the result
      OnAppStarted()
    }, 0);
  }, []);

  return (
    <main className="flex flex-col min-h-svh p-3">
      <h1 className="text-2xl text-center pb-6">Hello Yozora!</h1>
      <div id="result" className="result">
        {resultText}
      </div>
      <div id="input" className="input-box">
        <Input
          id="name"
          className="input"
          onChange={updateName}
          autoComplete="off"
          name="input"
          type="text"
        />
        <Button className="btn" onClick={greet}>
          Greet
        </Button>
      </div>
    </main>
  );
}

export default App;
