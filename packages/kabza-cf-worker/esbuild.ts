import esbuild from "esbuild";

// const watch = process.argv[2] === "--watch";

await esbuild.build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    platform: "neutral",
    outfile: "bundle.js",
    mainFields: ["main"],
    watch: true,
});