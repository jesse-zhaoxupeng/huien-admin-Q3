// .lintstagedrc.cjs
module.exports = {
  '**/*.{js,jsx,ts,tsx,vue}': [
    'eslint --cache --fix',
    'prettier --write --ignore-unknown'
  ],
  '**/*.{json,md,css,scss,html,yml,yaml}': [
    'prettier --write --ignore-unknown'
  ],
};
