declare module 'fs' {
  function readFileSync(path: string | number, options?: { encoding?: string; flag?: string; } | null): string;
}
