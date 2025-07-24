export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimitive | JsonComposite;

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
export type CallOptions = { process: string; timeoutMs?: number };
export type CastOptions = { process: string };

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
    opts: CallOptions,
  ): Promise<{ data: U; durationMs: number; error?: AnySerializable }>;
  /* Send a message to Elixir process */
  cast<T = AnySerializable>(args: T, opts: CastOptions): void;
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
