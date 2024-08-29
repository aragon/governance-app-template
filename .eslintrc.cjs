/* eslint-env node */
module.exports = {
  extends: ["next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "react/jsx-boolean-value": ["warn", "always"],
    "no-console": "warn",
    "prefer-template": "warn",
    "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "@typescript-eslint/no-duplicate-enum-values": "off",
    "@typescript-eslint/no-require-imports": "warn",
  },
  root: true,
};
