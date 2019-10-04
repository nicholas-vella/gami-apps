import fs = require('fs-extra');

import runPythonApp from '../run-python-app';

const loadPythonApps = apps => {
  apps.map(app => {
    const path = `./src/apps/${app}/index.py`;
    fs.pathExists(path, (err, exists) => (exists ? runPythonApp(path) : console.log(`Could not find app ${app}`)));
  });
};

export default loadPythonApps;
