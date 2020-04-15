const path = require('path');
const fsPromises = require('fs').promises;

async function checkBannerlordDir(dirPath) {
  if (!dirPath) {
    throw Error('⛔️ Must pass path to the Bannerlord directory.');
  }

  try {
    await fsPromises.access(`${dirPath}/Modules`);
    return true;
  } catch (error) {
    throw Error('⛔️ Could not find modules. Are you sure you passed the path to the Bannerlord directory?');
  }
}

const paths = {
  spNpcs: 'Modules/SandboxCore/ModuleData/spnpccharacters.xml',
  spNpcTemplates: 'Modules/SandboxCore/ModuleData/spnpccharactertemplates.xml',
  spSpecial: 'Modules/Sandbox/ModuleData/spspecialcharacters.xml',
  bandits: 'Modules/Sandbox/ModuleData/bandits.xml',
};

function getBannerlordXmlPath(bannerlordPath, key) {
  if (!paths[key]) {
    throw Error(`getBannerlordPath: Invalid key ${key}`);
  }

  return path.resolve(bannerlordPath, paths[key]);
}

module.exports = {
  checkBannerlordDir,
  getBannerlordXmlPath,
};
