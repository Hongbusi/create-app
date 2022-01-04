# Vue 3 + Typescript + Vite

## Usage

``` bash
# Install
yarn

# Init git hook
yarn run prepare

# Create a hook
yarn husky add .husky/commit-msg 'yarn commitlint --edit $1'

# Run
yarn run dev
```