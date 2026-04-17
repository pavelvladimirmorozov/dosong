// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const perfectionist = require("eslint-plugin-perfectionist");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: { perfectionist },
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["app", "com", "wid"],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        [
          {
            type: "element",
            prefix: ["app", "com", "wid"],
            style: "kebab-case",
          },
          {
            type: "attribute",
            prefix: ["app", "com", "wid"],
            style: "camelCase",
          },
        ],
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
          newlinesBetween: 1,
          internalPattern: [
            "^@components/.+",
            "^@pages/.+",
            "^@services/.+",
            "^@widgets/.+",
            "^@utils/.+",
          ],
          groups: [
            "side-effect",
            ["value-builtin", "value-external"],
            "type-external",
            "components",
            "internal-aliases",
            "type-internal",
            ["type-parent", "type-sibling", "type-index"],
            ["value-parent", "value-sibling", "value-index"],
            "side-effect-style",
            "value-style",
            "unknown",
          ],
          customGroups: [
            { groupName: "components", elementNamePattern: "^@components/.+" },
            {
              groupName: "internal-aliases",
              elementNamePattern: [
                "^@pages/.+",
                "^@widgets/.+",
                "^@services/.+",
                "^@utils/.+",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },
]);
