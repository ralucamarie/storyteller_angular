export interface AvatarSource {
  avatarUrl?: string | null;
  avatar_url?: string | null;
}

export interface ImageSource {
  imageUrl?: string | null;
  image_url?: string | null;
}

export function resolveAvatarUrl(source: AvatarSource | null | undefined): string | null {
  if (!source) {
    return null;
  }
  return source.avatarUrl ?? source.avatar_url ?? null;
}

export function resolveWritingImageUrl(source: ImageSource | null | undefined): string | null {
  if (!source) {
    return null;
  }
  return source.imageUrl ?? source.image_url ?? null;
}

export function withCacheBust(url: string | null, version?: string | null): string | null {
  if (!url) {
    return null;
  }
  if (!version) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}
