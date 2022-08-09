const path = require('path');

const rootPath = path.join(__dirname, '..');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');
const srcPreloadPath = path.join(srcPath, 'preload');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');

const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distDevPath = path.join(appPath, 'dev');

const buildPath = path.join(releasePath, 'build');

export default {
  rootPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  srcPreloadPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distDevPath,
  buildPath,
};
