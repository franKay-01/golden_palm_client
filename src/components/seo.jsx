import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Golden Palm Foods';
const SITE_URL = 'https://goldenpalmfoods.com';
const DEFAULT_DESCRIPTION =
  'Shop authentic West African food & global pantry staples online — Bambara beans, Ebesse chili paste, unrefined red palm oil & spices. Specialty international ingredients shipped across the USA.';
const DEFAULT_IMAGE = `${SITE_URL}/logo512.png`;

/**
 * Per-page SEO tags (title, description, canonical, Open Graph, Twitter) plus
 * optional JSON-LD structured data.
 *
 * Props:
 *  - title:        page title (appended with the site name)
 *  - description:  meta description
 *  - path:         route path for canonical/og:url (e.g. "/shop")
 *  - image:        absolute or root-relative OG image URL
 *  - type:         og:type ("website" | "article" | "product")
 *  - noIndex:      add <meta robots="noindex"> (e.g. review token pages)
 *  - jsonLd:       object or array of JSON-LD structured data
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const absImage = image?.startsWith('http') ? image : `${SITE_URL}${image}`;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={absImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absImage} />

      {/* Structured data */}
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
