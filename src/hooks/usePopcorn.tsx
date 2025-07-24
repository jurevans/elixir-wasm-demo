import { useEffect, useRef, useState } from "react";
import type { Popcorn } from "../types";

export const usePopcorn = () => {
  const [popcorn, setPopcorn] = useState<Popcorn>();
  const [error, setError] = useState<string>();
  const callRef = useRef(false);

  const setup = async (): Promise<void> => {
    try {
      const popcorn = await window.Popcorn.init({
        debug: true,
        // bundlePath: "wasm/bundle.avm",
        // container: document.body,
        onStdout: (text: string) => console.warn(`INFO: ${text}`),
        onStderr: (text: string) => console.warn(`ERROR: ${text}`),
      });
      setPopcorn(popcorn);
    } catch (e) {
      setError(`${e}`);
    }
  };

  useEffect(() => {
    if (window.Popcorn && callRef.current === false) {
      callRef.current = true;
      // It's important to not allow React to call this twice,
      // as it injects an iFrame!
      setup();
    }
  }, []);

  return { popcorn, error };
};
