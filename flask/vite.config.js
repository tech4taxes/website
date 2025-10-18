import {defineConfig} from "vite";
import {globSync} from "glob";
import path from "node:path";

export default defineConfig({
    server: {
        cors: {
            origin: ["http://127.0.0.1:8000", "http://localhost:8000"],
        },
    },
    build: {
        manifest: true,
        rollupOptions: {
            input: Object.fromEntries(globSync("./vite-src/**/index.ts").map(file => [
                path.dirname(path.relative("vite-src", file)),
                file 
            ])),
            preserveEntrySignatures: "strict",
            commonjsOptions: { transformMixedEsModules: true },
        },
        outDir: "build",
        emptyOutDir: false,
        assetsDir: "static/dist",
    },
});
