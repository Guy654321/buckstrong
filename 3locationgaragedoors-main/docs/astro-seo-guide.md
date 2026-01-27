# Astro SEO Implementation Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Props Reference](#props-reference)
5. [Advanced Features](#advanced-features)
6. [Open Graph Integration](#open-graph-integration)
7. [Twitter Cards](#twitter-cards)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

---

## Introduction

Astro SEO provides a comprehensive solution for implementing search engine optimization in your Astro projects. It's designed as a one-stop component that simplifies adding SEO-relevant meta tags, Open Graph data, Twitter cards, and other optimization elements to your pages.

### Key Features:
- **Complete SEO Coverage**: Handles meta tags, Open Graph, Twitter cards, and structured data
- **TypeScript Support**: Full type safety and IntelliSense support
- **Flexible Configuration**: Supports both basic and advanced SEO configurations
- **Performance Optimized**: Zero-overhead component that generates clean HTML
- **Extensible**: Easy to extend with custom meta tags and properties

---

## Installation

### Using npm:
```bash
npm install astro-seo
```

### Using yarn:
```bash
yarn add astro-seo
```

### Using pnpm:
```bash
pnpm add astro-seo
```

### Prerequisites:
- Astro 2.0 or higher
- Node.js 16.0 or higher

---

## Basic Usage

### 1. Import and Basic Setup

```astro
---
// src/pages/index.astro
import { SEO } from "astro-seo";
---

<html lang="en">
  <head>
    <SEO
      title="Your Page Title"
      description="A compelling description of your page content"
    />
  </head>
  <body>
    <!-- Your page content -->
  </body>
</html>
```

### 2. Layout Implementation

For consistent SEO across your site, implement in your base layout:

```astro
---
// src/layouts/BaseLayout.astro
import { SEO } from "astro-seo";

export interface Props {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

const { 
  title = "Default Site Title",
  description = "Default site description",
  canonical,
  noindex = false
} = Astro.props;
---

<html lang="en">
  <head>
    <SEO
      title={title}
      description={description}
      canonical={canonical}
      noindex={noindex}
      openGraph={{
        basic: {
          title: title,
          type: "website",
          image: "/og-image.jpg",
        }
      }}
    />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## Props Reference

### Basic SEO Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | ✅ | Page title (appears in browser tab and search results) |
| `description` | `string` | ✅ | Meta description for search engines (150-160 characters recommended) |
| `canonical` | `string` | ❌ | Canonical URL to prevent duplicate content issues |
| `noindex` | `boolean` | ❌ | Prevents page from being indexed by search engines |
| `nofollow` | `boolean` | ❌ | Prevents search engines from following links on the page |
| `titleTemplate` | `string` | ❌ | Template for generating titles (e.g., `%s | Site Name`) |
| `titleDefault` | `string` | ❌ | Default title when no title is provided |

### Meta Tags

| Property | Type | Description |
|----------|------|-------------|
| `charset` | `string` | Character encoding (default: "utf-8") |
| `languageAlternates` | `LanguageAlternate[]` | Alternate language versions |
| `additionalMetaTags` | `MetaTag[]` | Custom meta tags |
| `additionalLinkTags` | `LinkTag[]` | Custom link tags |

### Robots Configuration

```typescript
interface RobotsProps {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  nocache?: boolean;
}
```

---

## Advanced Features

### 1. Custom Meta Tags

Add custom meta tags using the `extend` property:

```astro
<SEO
  title="Advanced Page"
  description="Page with custom meta tags"
  extend={{
    meta: [
      { name: "author", content: "John Doe" },
      { name: "theme-color", content: "#0f3d3e" },
      { property: "fb:app_id", content: "123456789" }
    ],
    link: [
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }
    ]
  }}
/>
```

### 2. Favicon Configuration

```astro
<SEO
  title="My Site"
  description="Site description"
  extend={{
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }
    ]
  }}
/>
```

### 3. Language Alternates

```astro
<SEO
  title="Multilingual Page"
  description="Page with language alternatives"
  languageAlternates={[
    { hrefLang: "en", href: "https://example.com/en" },
    { hrefLang: "es", href: "https://example.com/es" },
    { hrefLang: "fr", href: "https://example.com/fr" }
  ]}
/>
```

---

## Open Graph Integration

### Basic Open Graph

```typescript
interface OpenGraphBasic {
  title: string;           // Required
  type: string;           // Required (e.g., "website", "article")
  image: string;          // Required
  url?: string;           // Optional but recommended
}
```

### Optional Open Graph Properties

```typescript
interface OpenGraphOptional {
  audio?: string;
  description?: string;
  determiner?: string;
  locale?: string;
  localeAlternate?: string[];
  siteName?: string;
  video?: string;
}
```

### Image Properties

```typescript
interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}
```

### Complete Example

```astro
<SEO
  title="Article Title"
  description="Article description"
  openGraph={{
    basic: {
      title: "Article Title",
      type: "article",
      image: "https://example.com/og-image.jpg",
      url: "https://example.com/article"
    },
    optional: {
      description: "Detailed article description",
      siteName: "My Blog",
      locale: "en_US",
      localeAlternate: ["es_ES", "fr_FR"]
    },
    image: {
      url: "https://example.com/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Article featured image",
      type: "image/jpeg"
    },
    article: {
      publishedTime: "2023-01-01T00:00:00Z",
      modifiedTime: "2023-01-02T00:00:00Z",
      author: ["John Doe", "Jane Smith"],
      section: "Technology",
      tag: ["astro", "seo", "web-development"]
    }
  }}
/>
```

---

## Twitter Cards

### Twitter Card Types

| Type | Description |
|------|-------------|
| `summary` | Default card with title, description, and thumbnail |
| `summary_large_image` | Similar to summary but with large image |
| `app` | Card for mobile app promotion |
| `player` | Card with video/audio player |

### Basic Twitter Card

```astro
<SEO
  title="Page Title"
  description="Page description"
  twitter={{
    card: "summary_large_image",
    site: "@yourtwitterhandle",
    creator: "@authortwitterhandle"
  }}
/>
```

### Advanced Twitter Configuration

```astro
<SEO
  title="Video Article"
  description="Article with embedded video"
  twitter={{
    card: "player",
    site: "@yoursite",
    creator: "@author",
    player: {
      url: "https://example.com/player",
      width: 1280,
      height: 720
    },
    app: {
      name: {
        iphone: "Your App",
        ipad: "Your App HD",
        googleplay: "Your App"
      },
      id: {
        iphone: "123456789",
        ipad: "123456789",
        googleplay: "com.example.app"
      },
      url: {
        iphone: "yourapp://article/123",
        ipad: "yourapp://article/123",
        googleplay: "yourapp://article/123"
      }
    }
  }}
/>
```

---

## Best Practices

### 1. SEO-Friendly Structure

```astro
---
// src/layouts/SEOLayout.astro
import { SEO } from "astro-seo";

export interface Props {
  title: string;
  description: string;
  type?: "website" | "article" | "product";
  image?: string;
  article?: {
    publishedTime?: string;
    author?: string[];
    section?: string;
    tag?: string[];
  };
}

const {
  title,
  description,
  type = "website",
  image = "/default-og-image.jpg",
  article
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(image, Astro.site);
---

<SEO
  title={`${title} | Your Site Name`}
  description={description}
  canonical={canonicalURL.toString()}
  openGraph={{
    basic: {
      title: title,
      type: type,
      image: imageURL.toString(),
      url: canonicalURL.toString()
    },
    optional: {
      description: description,
      siteName: "Your Site Name"
    },
    ...(type === "article" && article && {
      article: {
        publishedTime: article.publishedTime,
        author: article.author,
        section: article.section,
        tag: article.tag
      }
    })
  }}
  twitter={{
    card: "summary_large_image",
    site: "@yoursite",
    creator: "@yourhandle"
  }}
/>
```

### 2. Dynamic SEO for Collections

```astro
---
// src/pages/blog/[slug].astro
import { SEO } from "astro-seo";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { title, description, publishedDate, author, tags } = post.data;
---

<html>
  <head>
    <SEO
      title={title}
      description={description}
      canonical={`https://yoursite.com/blog/${post.slug}`}
      openGraph={{
        basic: {
          title: title,
          type: "article",
          image: `https://yoursite.com/og/${post.slug}.jpg`
        },
        optional: {
          description: description,
          siteName: "Your Blog"
        },
        article: {
          publishedTime: publishedDate.toISOString(),
          author: [author],
          section: "Blog",
          tag: tags
        }
      }}
    />
  </head>
  <body>
    <!-- Article content -->
  </body>
</html>
```

### 3. E-commerce SEO

```astro
---
// src/pages/products/[id].astro
import { SEO } from "astro-seo";

const { product } = Astro.props;
const {
  name,
  description,
  price,
  currency,
  availability,
  brand,
  images
} = product;
---

<SEO
  title={`${name} - ${brand} | Your Store`}
  description={description}
  openGraph={{
    basic: {
      title: name,
      type: "product",
      image: images[0]
    },
    optional: {
      description: description,
      siteName: "Your Store"
    },
    product: {
      price: price,
      currency: currency,
      availability: availability,
      brand: brand,
      condition: "new"
    }
  }}
  extend={{
    meta: [
      { name: "product:price:amount", content: price.toString() },
      { name: "product:price:currency", content: currency }
    ]
  }}
/>
```

### 4. Performance Considerations

```astro
---
// Optimize images for different social platforms
const ogImage = `/og-images/${slug}-1200x630.jpg`;
const twitterImage = `/og-images/${slug}-1200x600.jpg`;
---

<SEO
  title={title}
  description={description}
  openGraph={{
    basic: {
      title: title,
      type: "article",
      image: ogImage
    },
    image: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: `Featured image for ${title}`
    }
  }}
  twitter={{
    card: "summary_large_image",
    image: twitterImage
  }}
/>
```

---

## Examples

### Blog Post SEO

```astro
---
// src/pages/blog/astro-seo-guide.astro
import { SEO } from "astro-seo";
import Layout from "../../layouts/BaseLayout.astro";
---

<Layout>
  <SEO
    slot="head"
    title="Complete Guide to Astro SEO Implementation"
    description="Learn how to implement comprehensive SEO in your Astro projects with meta tags, Open Graph, Twitter cards, and structured data."
    canonical="https://yourblog.com/blog/astro-seo-guide"
    openGraph={{
      basic: {
        title: "Complete Guide to Astro SEO Implementation",
        type: "article",
        image: "https://yourblog.com/images/astro-seo-guide-og.jpg",
        url: "https://yourblog.com/blog/astro-seo-guide"
      },
      optional: {
        description: "Comprehensive tutorial covering SEO implementation in Astro projects",
        siteName: "Your Dev Blog",
        locale: "en_US"
      },
      article: {
        publishedTime: "2023-12-01T10:00:00.000Z",
        modifiedTime: "2023-12-01T15:30:00.000Z",
        author: ["John Developer"],
        section: "Web Development",
        tag: ["astro", "seo", "web-development", "tutorial"]
      }
    }}
    twitter={{
      card: "summary_large_image",
      site: "@yourdevblog",
      creator: "@johndeveloper",
      title: "Complete Guide to Astro SEO Implementation",
      description: "Learn comprehensive SEO implementation in Astro projects",
      image: "https://yourblog.com/images/astro-seo-guide-twitter.jpg"
    }}
    extend={{
      meta: [
        { name: "author", content: "John Developer" },
        { name: "keywords", content: "astro, seo, meta tags, open graph, twitter cards" },
        { property: "article:reading_time", content: "8" }
      ],
      link: [
        { rel: "alternate", type: "application/rss+xml", href: "/rss.xml" }
      ]
    }}
  />
  
  <!-- Article content -->
  <article>
    <h1>Complete Guide to Astro SEO Implementation</h1>
    <!-- Content... -->
  </article>
</Layout>
```

### Landing Page SEO

```astro
---
// src/pages/services/web-development.astro
import { SEO } from "astro-seo";
---

<html lang="en">
  <head>
    <SEO
      title="Professional Web Development Services | Your Agency"
      description="Custom web development services including Astro, React, and Node.js. Fast, SEO-optimized websites that drive results. Free consultation available."
      canonical="https://youragency.com/services/web-development"
      openGraph={{
        basic: {
          title: "Professional Web Development Services",
          type: "website",
          image: "https://youragency.com/images/web-dev-services-og.jpg",
          url: "https://youragency.com/services/web-development"
        },
        optional: {
          description: "Expert web development services with modern frameworks and best practices",
          siteName: "Your Agency",
          locale: "en_US"
        }
      }}
      twitter={{
        card: "summary_large_image",
        site: "@youragency",
        title: "Professional Web Development Services",
        description: "Custom web development with modern frameworks. Free consultation.",
        image: "https://youragency.com/images/web-dev-services-twitter.jpg"
      }}
      extend={{
        meta: [
          { name: "geo.region", content: "US-NY" },
          { name: "geo.placename", content: "New York" },
          { property: "business:contact_data:locality", content: "New York" },
          { property: "business:contact_data:region", content: "NY" }
        ],
        link: [
          { rel: "preconnect", href: "https://fonts.googleapis.com" },
          { rel: "dns-prefetch", href: "https://api.youragency.com" }
        ]
      }}
    />
  </head>
  <body>
    <!-- Landing page content -->
  </body>
</html>
```

---

## TypeScript Interfaces

For TypeScript users, here are the main interfaces:

```typescript
interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  titleTemplate?: string;
  titleDefault?: string;
  languageAlternates?: LanguageAlternate[];
  openGraph?: OpenGraph;
  twitter?: Twitter;
  extend?: {
    meta?: MetaTag[];
    link?: LinkTag[];
  };
}

interface OpenGraph {
  basic: OpenGraphBasic;
  optional?: OpenGraphOptional;
  image?: OpenGraphImage;
  article?: OpenGraphArticle;
  book?: OpenGraphBook;
  profile?: OpenGraphProfile;
  product?: OpenGraphProduct;
}

interface Twitter {
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  player?: TwitterPlayer;
  app?: TwitterApp;
}
```

---

This comprehensive guide covers all aspects of SEO implementation in Astro projects. The component provides a clean, type-safe way to handle all SEO requirements while maintaining excellent performance and developer experience.