export function debugLog(v: any, label?: string) {
  if (label) {
    console.log(label);
  }
  console.log('🚀===============================🚀');
  console.dir(v, { depth: null });
  console.log('🚀===============================🚀');
}
