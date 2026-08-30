/** Prefix root-relative paths with Vite base (needed for GitHub Pages project sites). */
export function assetUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  const base = import.meta.env.BASE_URL;
  return `${base}${path.slice(1)}`;
}
