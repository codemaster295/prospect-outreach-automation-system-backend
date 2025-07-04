import { URL } from 'url';

export class UrlUtils {
  static normalizeUrl(url: string, baseUrl?: string): string | null {
    try {
      const normalized = new URL(url, baseUrl);
      normalized.hash = '';

      // Only allow http and https protocols
      if (normalized.protocol !== 'http:' && normalized.protocol !== 'https:') {
        return null;
      }

      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
      trackingParams.forEach(param => normalized.searchParams.delete(param));

      // Ensure trailing slash consistency — add slash if pathname is empty
      if (!normalized.pathname || normalized.pathname === '') {
        normalized.pathname = '/';
      }
      const href = normalized.href;

      return href;
    } catch (error: any) {
      console.warn("❌ Failed to normalize URL:", url, "with base:", baseUrl, error.message);
      return null;
    }
  }

  static isSameDomain(url1: string, url2: string): boolean {
    try {
      const domain1 = new URL(url1).hostname;
      const domain2 = new URL(url2).hostname;
      return domain1 === domain2;
    } catch {
      return false;
    }
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static shouldSkipUrl(url: string): boolean {
    const skipExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.mp4', '.mp3'];
    const skipPatterns = ['/wp-admin/', '/login', '/register', '/cart', '/checkout'];

    const urlLower = url.toLowerCase();

    const skipByExtension = skipExtensions.find(ext => urlLower.endsWith(ext));
    const skipByPattern = skipPatterns.find(pattern => urlLower.includes(pattern));

    if (skipByExtension) {
      return true;
    }

    if (skipByPattern) {
      return true;
    }

    return false;
  }
}
