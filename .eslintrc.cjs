module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react'
    ],
    env: {
		browser: true
	},
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "semi": ["error", "always"],
		"indent": ["error", "tab"],
		"quote-props": ["error", "as-needed"],
		"quotes": [2, "single", "avoid-escape"]
	}
};