/// <reference types="vite/client" />

/**
 * Resolves an asset path against the base URL (relative or subpath)
 * so that assets like photos and audio load seamlessly in any environment:
 * - Local development (http://localhost:3000/)
 * - Custom domain or root domain (Vercel, Netlify)
 * - GitHub Pages subpaths (https://<username>.github.io/<repo-name>/)
 */
export const getAssetUrl = (path: string): string => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};
