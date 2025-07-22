import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { init } from "./utils";
import type { Popcorn } from "./assets/wasm/popcorn";

const EVAL_ELIXIR = "eval_elixir";
const EVAL_CODE = `case Enum.max([1, 2, 3]) do
    3 -> {:ok, 3}
    2 -> {:error, 2}
end
`;

async function sendEvalRequest(popcorn: Popcorn, code: string) {
  if (code === "") {
    return;
  }
  console.log("Evaluating...");
  try {
    const action = EVAL_ELIXIR;
    const { data, durationMs } = await popcorn.call([action, code], {
      process: "main",
      timeoutMs: 10_000,
    });
    console.log("RESULTS!", { data, durationMs });
  } catch (e) {
    console.error(e);
  }
}

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    init().then((popcorn) => {
      console.log("POPCORN->", popcorn);
      if (popcorn) {
        sendEvalRequest(popcorn, EVAL_CODE);
      }
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
