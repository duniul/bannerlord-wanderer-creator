const fs = require('fs-extra');
const path = require('path');

const tempSourceRoot = path.resolve(__dirname, '../../BannerlordTempSource');

const tempSourceDirs = {
  root: tempSourceRoot,
  sandBoxCoreData: path.resolve(tempSourceRoot, 'SandBoxCore/ModuleData'),
  sandBoxData: path.resolve(tempSourceRoot, 'SandBox/ModuleData'),
};

function getAbsoluteInstallDir(bannerlordInstallDir) {
  const absoluteInstallDir = path.resolve(process.cwd(), bannerlordInstallDir);
  const modulesDir = path.resolve(absoluteInstallDir, 'Modules');

  if (!bannerlordInstallDir || !fs.existsSync(modulesDir)) {
    throw new Error(`Invalid Bannerlord dir! Are you sure the path is correct? ("${bannerlordInstallDir}")`);
  }

  return absoluteInstallDir;
}

function verifyTempSourceDirs() {
  if (!fs.existsSync(tempSourceDirs.root)) {
    throw new Error(
      `Local modules have not been loaded from the Bannerlord install dir yet. Run copyModuleDataXmls.js first!`
    );
  }
}

module.exports = {
  tempSourceDirs,
  getAbsoluteInstallDir,
  verifyTempSourceDirs,
};
