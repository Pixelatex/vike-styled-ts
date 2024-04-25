import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { cjsInterop } from "vite-plugin-cjs-interop";

export default {
  ssr: {
    // Add problematic npm package here:
    noExternal: ["@apollo/client", "styled-components", "@emotion/*"],
  },
  plugins: [
    react({
      babel: {
        plugins: ["styled-components"],
        babelrc: false,
        configFile: false,
      },
    }),
    vike(),
    cjsInterop({
      dependencies: [
        // Add problematic npm package here
        "@apollo/client/*",
      ],
    }),
  ],
};
