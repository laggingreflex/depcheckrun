#!/usr/bin/env node

const { spawn } = require('child_process');

if (module.parent) {
  if (
    /* Enable if an environment variable like DEPCHECKRUN exists */
    Object.keys(process.env).find(k => k.toLowerCase().includes('depcheck'))) {
    console.warn(`[DepCheckRun] Enabled. Missing dependencies will be automatically installed`);
    process.on('uncaughtException', onUncaughtException);
  }
} else {
  console.warn(`[DepCheckRun] Enabled. Missing dependencies will be automatically installed`);
  process.on('uncaughtException', onUncaughtException);
  process.argv.splice(1, 1);
  run(process.argv).catch(onUncaughtException);
}

async function onUncaughtException(error, origin) {
  let match;
  if (error.message && (match = error.message.match(/Cannot find module '(.*)'/))) {
    const [, moduleName] = match;
    if (moduleName) {
      console.warn(error.message);
      console.warn(`[DepCheckRun] Installing: ${moduleName}...`);
      await run(['npm', 'install', moduleName]);
      console.log(`[DepCheckRun] Installed: ${moduleName}`);
      console.log(`[DepCheckRun] Re-running:`, ...process.argv);
      await run(process.argv);
    }
  } else {
    console.error(error);
  }
}

function run([cmd, ...args], opts) {
  const cp = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  return new Promise((resolve, reject) => cp.on('exit', code => code ? reject(code) : resolve()));
}
