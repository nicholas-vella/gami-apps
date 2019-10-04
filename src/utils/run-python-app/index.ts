import { Options, PythonShell } from 'python-shell';

const runPythonApp = (path, options = {}) => {
  const DEFAULT_OPTIONS: Options = {
    mode: 'text',
    pythonOptions: ['-u'],
  };

  PythonShell.run(path, { ...DEFAULT_OPTIONS, ...options }, (err, res) => {
    if (err) {
      throw err;
    }

    console.log(res);
  });
};

export default runPythonApp;
