import { type Popcorn as IPopcorn } from "./types/Popcorn";
declare global {
  interface Window {
    Popcorn: IPopcorn;
  }
}

let isInitializedCalled: boolean = false;
let popcornPromise: Promise<IPopcorn> | undefined = undefined;

export const init = async (): Promise<IPopcorn | undefined> => {
  if (!isInitializedCalled && !popcornPromise) {
    isInitializedCalled = true;
    console.log("POPCORN?", window.Popcorn);
    popcornPromise = window.Popcorn.init({
      debug: true,
      bundlePath: "wasm/bundle.avm",
      // container: document.body,
      onStdout: (text: string) => console.warn(`INFO: ${text}`),
      onStderr: (text: string) => console.warn(`ERROR: ${text}`),
    });
    return popcornPromise;
  }
};
