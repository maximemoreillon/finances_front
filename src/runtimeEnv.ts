// Build-time values (from .env files) overridden by runtime values injected
// into window.__ENV__ by env.js when the container starts.
export const env: ImportMetaEnv = {
  ...import.meta.env,
  ...window.__ENV__,
}
