export type WritingImagePlacement = 'block' | 'left' | 'right';

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

export function looksLikeHtml(value: string | null | undefined): boolean {
  const trimmed = (value ?? '').trimStart();
  return trimmed.startsWith('<') && trimmed.includes('>');
}

export function isWritingHtmlEmpty(value: string | null | undefined): boolean {
  if (!value?.trim()) {
    return true;
  }
  if (!looksLikeHtml(value)) {
    return !value.trim();
  }

  const container = document.createElement('div');
  container.innerHTML = value;
  const text = (container.textContent ?? '').replace(/\u00a0/g, ' ').trim();
  if (text) {
    return false;
  }
  return container.querySelector('img') === null;
}

export function plainTextToWritingHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }
  if (looksLikeHtml(trimmed)) {
    return trimmed;
  }

  const paragraphs = trimmed.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  if (!paragraphs.length) {
    return `<p>${escapeHtml(trimmed).replace(/\n/g, '<br>')}</p>`;
  }

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

export function htmlToPlainText(value: string | null | undefined): string {
  if (!value?.trim()) {
    return '';
  }

  const normalized = value.trim();
  const hasHtml = looksLikeHtml(normalized) || HTML_TAG_PATTERN.test(normalized);

  if (!hasHtml) {
    return decodeHtmlEntities(normalized);
  }

  if (typeof document !== 'undefined') {
    const container = document.createElement('div');
    container.innerHTML = normalized;
    const parsed = (container.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    if (parsed) {
      return parsed;
    }
  }

  return stripHtmlWithRegex(normalized);
}

export function writingPreviewText(value: string | null | undefined): string {
  return htmlToPlainText(value).replace(/\s+/g, ' ').trim();
}

function stripHtmlWithRegex(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function appendPlainTextToWritingHtml(currentHtml: string, text: string): string {
  const addition = plainTextToWritingHtml(text);
  if (!addition) {
    return currentHtml;
  }
  if (!currentHtml?.trim() || isWritingHtmlEmpty(currentHtml)) {
    return addition;
  }
  return `${currentHtml}${addition}`;
}

export function writingImageClass(placement: WritingImagePlacement): string {
  switch (placement) {
    case 'left':
      return 'writing-img-left';
    case 'right':
      return 'writing-img-right';
    default:
      return 'writing-img-block';
  }
}

export function buildWritingImageHtml(url: string, placement: WritingImagePlacement): string {
  const cssClass = writingImageClass(placement);
  if (placement === 'block') {
    return `<p class="writing-img-frame writing-img-frame--block"><img src="${url}" class="${cssClass}" alt="" loading="lazy" /></p>`;
  }
  return `<p class="writing-img-frame writing-img-frame--side"><img src="${url}" class="${cssClass}" alt="" loading="lazy" /></p>`;
}

export function extractFirstImageUrl(
  html: string | null | undefined,
  legacyImageUrl?: string | null
): string | null {
  if (html && looksLikeHtml(html)) {
    const container = document.createElement('div');
    container.innerHTML = html;
    const img = container.querySelector('img');
    if (img?.getAttribute('src')) {
      return img.getAttribute('src');
    }
  }
  return legacyImageUrl ?? null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function resolveWritingHtml(
  source:
    | {
        text?: string | null;
        imageUrl?: string | null;
        image_url?: string | null;
      }
    | null
    | undefined
): string {
  const text = source?.text ?? '';
  if (looksLikeHtml(text)) {
    return text;
  }

  const legacyImageUrl = source?.imageUrl ?? source?.image_url ?? null;
  const body = plainTextToWritingHtml(text);
  if (legacyImageUrl) {
    return `${buildWritingImageHtml(legacyImageUrl, 'block')}${body}`;
  }
  return body;
}

export function stripHtmlTags(value: string | null | undefined): string {
  if (!value?.trim()) {
    return '';
  }
  return htmlToPlainText(value);
}
