import { PythonShell } from 'python-shell';

const loadPython = (path, options = {}) => {
  const DEFAULT_OPTIONS: any = {
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

export default loadPython;
