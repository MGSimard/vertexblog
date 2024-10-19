/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  devIndicators: {
    appIsrStatus: false,
  },
  serverExternalPackages: ["@node-rs/argon2"],
  // TODO: REMOVE BOTH TS AND ESLINT IGNOREDURINGBUILDS AFTER NEXT 15 IS STABLE WITH ESLINT 9
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
