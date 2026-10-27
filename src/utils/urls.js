const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function withBasePath(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }
  return `${basePath}${normalizedPath}`;
}

export function apiUrl(path) {
  return withBasePath(path);
}

export function assetUrl(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) return path;
  if (!path.startsWith('/images/') && !path.startsWith('/uploads/')) return path;
  return withBasePath(path);
}
