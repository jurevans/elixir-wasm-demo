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

export interface Popcorn {
  onStdout: (text: string) => void;
  onStderr: (text: string) => void;
  heartbeatTimeoutMs: number | null;
  init(params: InitParams): Promise<Popcorn>;
  deinit(): void;
  call(
    args: AnySerializable,
    { process, timeoutMs }: { process: string; timeoutMs: number },
  ): Promise<{ data: AnySerializable; durationMs: number }>;
  cast(args: AnySerializable, { process }: { process: string }): void;
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
