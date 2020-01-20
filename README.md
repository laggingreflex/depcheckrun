
# DepCheckRun

Auto-install missing dependencies when running a node project.

Whenever an error is encountered like `Cannot find module 'xyz'` it will run `npm install xyz` and re-run the original command.

## Install

```
npm i [-g] depcheckrun
```

## Usage

Instead of `node index.js`, run:

```
depcheckrun index.js
```
