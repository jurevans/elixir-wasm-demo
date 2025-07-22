import { Popcorn } from "./assets/wasm/popcorn";

let isInitializedCalled: boolean = false;
let popcorn: Popcorn | undefined = undefined;

export const init = async (): Promise<Popcorn | undefined> => {
  if (!isInitializedCalled && !popcorn) {
    isInitializedCalled = true;
    popcorn = await Popcorn.init({
      debug: true,
      bundlePath: "./wasm/bundle.avm",
      // container: document.body,
      onStdout: (text: string) => console.info(text),
      onStderr: (text: string) => console.error(text),
    });
    return popcorn;
  }
};
