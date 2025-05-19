const processEnv = typeof process !== 'undefined' ? process.env : {};
const injectedEnv = window && window.injectedEnv ? window.injectedEnv : {};

export const env = {
  
  ...processEnv,
  ...injectedEnv,
};