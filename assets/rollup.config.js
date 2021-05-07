import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

export default require("fs")
    .readdirSync("src/entries/")
    .map((file, index) => {
        const name = require("path").parse(file).name;

        return {
            input: `src/entries/${name}.ts`,
            output: {
                format: "iife",
                sourcemap: !production,
                name: name,
                dir: "../priv/static/",
                entryFileNames: "js/[name].js",
            },
            plugins: [
                svelte({
                    preprocess: sveltePreprocess({ sourceMap: !production }),
                    compilerOptions: {
                        // enable run-time checks when not in production
                        dev: !production,
                    },
                }),

                css({ output: `css/${name}.css` }),

                resolve({
                    browser: true,
                    dedupe: ["svelte"],
                }),
                commonjs(),
                typescript({
                    sourceMap: !production,
                    inlineSources: !production,
                }),

                // If we're building for production (npm run build
                // instead of npm run dev), minify
                production && terser(),

				// Copy assets if we haven't yet done so
                index === 0 &&
                    copy({
                        targets: [
                            { src: "public/**/*", dest: "../priv/static" },
                        ],
                    }),
            ],
            watch: {
                clearScreen: false,
            },
        };
    });
