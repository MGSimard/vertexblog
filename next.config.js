import MillionLint from "@million/lint";
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
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default MillionLint.next({
  enabled: true,
  rsc: true,
})(config);
