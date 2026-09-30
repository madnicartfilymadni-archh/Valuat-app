import React, { useEffect } from 'react';
import { useAppDirectory } from '../context/AppContext';
import { CATEGORIES } from '../data/defaultApps';

const BASE_URL = 'https://valuat.netlify.app';
const DEFAULT_TITLE = 'AppVault – Apps & Tools Directory';
const DEFAULT_DESCRIPTION = 'Discover useful apps, AI tools, online tools, Android apps, productivity tools, and daily utilities in one place.';

export const SeoManager: React.FC = () => {
  const { selectedApp, selectedCategory, isBgRemoverOpen } = useAppDirectory();

  useEffect(() => {
    // 1. Determine current page context
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let canonical = `${BASE_URL}/`;
    let structuredData: any = null;

    if (selectedApp) {
      title = `${selectedApp.name} – Features, Reviews & Official Link | AppVault`;
      description = selectedApp.tagline || selectedApp.description;
      canonical = `${BASE_URL}/?app=${encodeURIComponent(selectedApp.id)}`;

      // Category match
      const cat = CATEGORIES.find(c => c.id === selectedApp.category);
      const appCategoryName = cat ? cat.name : 'Utility';

      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': selectedApp.name,
        'headline': selectedApp.tagline || selectedApp.name,
        'description': selectedApp.description,
        'applicationCategory': appCategoryName,
        'operatingSystem': selectedApp.platforms.join(', '),
        'url': selectedApp.websiteUrl,
        'offers': {
          '@type': 'Offer',
          'price': selectedApp.pricing === 'Free' ? '0' : '0',
          'priceCurrency': 'USD',
          'category': selectedApp.pricing
        },
        'aggregateRating': selectedApp.rating ? {
          '@type': 'AggregateRating',
          'ratingValue': selectedApp.rating.toFixed(1),
          'ratingCount': selectedApp.reviewCount || 100,
          'bestRating': '5',
          'worstRating': '1'
        } : undefined,
        'author': {
          '@type': 'Organization',
          'name': selectedApp.developer
        }
      };
    } else if (isBgRemoverOpen) {
      title = 'Instant Online Background Remover – AppVault Tools';
      description = 'Free online AI background remover. Upload photos and remove background automatically with instant transparent PNG download.';
      canonical = `${BASE_URL}/?tool=bg-remover`;
      
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Online Background Remover',
        'applicationCategory': 'MultimediaApplication',
        'description': 'Free automated image background removal tool.',
        'url': canonical,
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      };
    } else if (selectedCategory && selectedCategory !== 'all') {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      if (cat) {
        title = `${cat.name} – Best Apps & Verified Tools | AppVault`;
        description = `${cat.description} Explore top rated ${cat.name.toLowerCase()} with official links.`;
        canonical = `${BASE_URL}/?category=${encodeURIComponent(selectedCategory)}`;
      }
    }

    // 2. Update Document Title
    document.title = title;

    // 3. Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // 4. Update Canonical Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // 5. Update Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    // 6. Update Twitter Card Tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);

    // 7. Inject / Update Dynamic JSON-LD Structured Data
    const SCRIPT_ID = 'dynamic-seo-schema';
    let schemaScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    
    if (structuredData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = SCRIPT_ID;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(structuredData);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // 8. Update Browser URL cleanly without reload
    try {
      const url = new URL(window.location.href);
      if (selectedApp) {
        url.searchParams.set('app', selectedApp.id);
        url.searchParams.delete('category');
        url.searchParams.delete('tool');
      } else if (isBgRemoverOpen) {
        url.searchParams.set('tool', 'bg-remover');
        url.searchParams.delete('app');
      } else if (selectedCategory && selectedCategory !== 'all') {
        url.searchParams.set('category', selectedCategory);
        url.searchParams.delete('app');
        url.searchParams.delete('tool');
      } else {
        url.searchParams.delete('app');
        url.searchParams.delete('tool');
        url.searchParams.delete('category');
      }

      window.history.replaceState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
    } catch (err) {
      // Ignore URL manipulation failures on restricted sandboxes
    }

  }, [selectedApp, selectedCategory, isBgRemoverOpen]);

  return null;
};
