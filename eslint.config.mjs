import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/components/domain/dashboard/dashboard-workspace-view.tsx"],
    rules: {
      // The dashboard preview intentionally generates relative demo timestamps at render time.
      "react-hooks/purity": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".vercel/**",
    "coverage/**",
    "out/**",
    "build/**",
    "packages/*/dist/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
