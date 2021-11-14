const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const { getAbsoluteInstallDir, tempSourceDirs } = require('./helpers/bannerlordFiles');

const relativeBannerlordDir = process.argv[3] || process.env.BANNERLORD_DIR;
const installDir = getAbsoluteInstallDir(relativeBannerlordDir);
const installModulesDir = path.resolve(installDir, 'Modules');

function getModuleDataXmls(moduleName) {
  const moduleDataPath = path.resolve(installModulesDir, `${moduleName}/ModuleData`);
  return globby.sync(['**/*.xml'], {
    cwd: moduleDataPath,
    absolute: true,
    ignore: ['**/Languages/**'],
  });
}

function copyBannerlordFile(bannerlordFilePath) {
  const localFilePath = bannerlordFilePath.replace(installModulesDir + '/', '');
  const outputFilePath = path.resolve(tempSourceDirs.root, localFilePath);

  fs.ensureDirSync(path.dirname(outputFilePath));
  fs.copyFileSync(bannerlordFilePath, outputFilePath);
}

const sandBoxCoreXmls = getModuleDataXmls('SandBoxCore');
const sandBoxXmls = getModuleDataXmls('SandBox');
const allXmls = [...sandBoxCoreXmls, ...sandBoxXmls];

allXmls.forEach(copyBannerlordFile);

const relativeLocalModules = path.relative(process.cwd(), tempSourceDirs.root);
console.log(`✅ Copied ${allXmls.length} XMLs from the Bannerlord install dir into: ./${relativeLocalModules}`);
