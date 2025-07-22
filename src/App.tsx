import { useCallback, useState } from "react";
import "./App.css";
import { type Json, type Popcorn } from "./types/Popcorn";
import { usePopcorn } from "./hooks/usePopcorn";

const EVAL_ELIXIR = "eval_elixir";
const EVAL_CODE = `case Enum.max([1, 2, 3]) do
    3 -> {:ok, 3}
    2 -> {:error, 2}
end
`;

async function sendEvalRequest(
  popcorn: Popcorn,
  code: string,
): Promise<{ data: Json; durationMs: number } | undefined> {
  if (code === "") {
    return;
  }
  try {
    const action = EVAL_ELIXIR;
    const result = await popcorn.call([action, code], {
      process: "main",
      timeoutMs: 10_000,
    });
    return result;
  } catch (e) {
    console.error("FAILED TO CALL", e);
  }
}

enum Status {
  Idle,
  Pending,
  Error,
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const TextArea = ({ label, value, onChange }: TextAreaProps) => (
  <div className="mb-4">
    <label
      className="block text-gray-400 text-sm font-bold mb-2"
      htmlFor={`input-${label.toLowerCase()}`}
    >
      {label}
    </label>
    <textarea
      id={`input-${label.toLowerCase()}`}
      value={value}
      className={[
        "shadow appearance-none border rounded w-full h-[420px] py-2 px-3 text-gray-300 leading-tight",
        "focus:outline-none focus:shadow-outline",
      ].join(" ")}
      onChange={onChange}
    />
  </div>
);

function App() {
  const [result, setResult] = useState<Json>();
  const [status, setStatus] = useState(Status.Idle);
  const [code, setCode] = useState(EVAL_CODE);
  const [error, setErrorResult] = useState<string>();
  const { popcorn, error: popcornError } = usePopcorn();

  const handleSubmit = useCallback(async () => {
    if (popcorn && code) {
      setStatus(Status.Pending);
      const res = await sendEvalRequest(popcorn, code).catch((e) => {
        setStatus(Status.Error);
        setErrorResult(`${e}`);
      });
      if (res) {
        setResult(res);
        setErrorResult(undefined);
      } else {
        setErrorResult("Did not get a response");
      }
      setStatus(Status.Idle);
    }
  }, [popcorn, code]);

  return (
    <div className="bg-black flex items-center justify-center w-full min-h-screen">
      <div className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[600px]">
        {popcornError && (
          <p className="p-4 text-red-700 font-bold text-center">
            {popcornError}
          </p>
        )}

        <TextArea
          label="Enter some Elixir:"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {status !== Status.Pending && result && (
          <pre className="p-4 text-orange-400 font-bold">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
        {status === Status.Pending && (
          <p className="p-4 text-orange-400 font-bold text-center">
            Calling WASM...
          </p>
        )}

        {error && (
          <p className="p-4 text-red-700 font-bold text-center">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <button
            className={[
              "bg-gray-500 text-orange-300 font-bold py-2 px-4 mt-4 rounded",
              "hover:bg-gray-700 focus:outline-none focus:shadow-outline w-full",
              "disabled:bg-gray-200 disabled:text-gray-400",
            ].join(" ")}
            type="button"
            disabled={!code || status === Status.Pending}
            onClick={handleSubmit}
          >
            Submit Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
