export type JsonPrimative = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimative | JsonComposite;

export type InitParams = {
  bundlePath?: string;
  container?: HTMLElement;
  onStderr?: (text: string) => void;
  onStdout: (text: string) => void;
  headbeatTimeoutMs?: number;
  wasmDir?: string;
  debug?: boolean;
};

export type AnySerializable = Json;
export type VmArgs = { process: string; timeoutMs?: number };

export interface Popcorn {
  /* Stdout handler, defaults to console.log() */
  onStdout: (text: string) => void;
  /* Stderr handler, defaults to console.warn() */
  onStderr: (text: string) => void;
  /* Create iFrame and establish communication channels */
  init(params: InitParams): Promise<Popcorn>;
  /* Destroy iFrame and reset the instance */
  deinit(): void;
  /* Send a message to Elixir process expecting a result */
  call<T = AnySerializable, U = AnySerializable>(
    args: T,
    vmArg: VmArgs,
  ): Promise<{ data: U; durationMs: number; error?: string }>;
  /* Send a message to Elixir process */
  cast<T = AnySerializable>(args: T, vmArgs: VmArgs): void;
}

declare global {
  interface Window {
    Popcorn: Popcorn;
  }
}

export type WindowWithPopcorn = Window &
  typeof globalThis & {
    Popcorn: Popcorn;
  };
