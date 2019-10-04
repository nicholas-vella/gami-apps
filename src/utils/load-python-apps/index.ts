import runPythonApp from '../run-python-app';

const loadPythonApps = apps => {
  apps.map(app => runPythonApp(`./src/apps/${app}/index.py`));
};

export default loadPythonApps;
