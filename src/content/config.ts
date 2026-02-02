import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      author: z.string(),
      tags: z.array(z.string()),
      image: image().or(z.string()).optional(),
    }),
});

const addressSchema = z
  .object({
    streetAddress: z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    postalCode: z.string(),
    addressCountry: z.string().default('US'),
  })
  .partial({
    addressCountry: true,
  });

const geoSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const locations = defineCollection({
  type: 'data',
  schema: () =>
    z.object({
      name: z.string(),
      slug: z.string(),
      state: z.string(),
      phone: z.string(),
      market: z.string(),
      parentHub: z.string().optional(),
      showAddress: z.boolean().default(true),
      serviceAreaBusiness: z.boolean().default(false),
      address: addressSchema.optional(),
      geo: geoSchema,
      gbpUrl: z.string().url().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      heroImage: z.string().optional(),
      zips: z.array(z.string()).optional(),
      surroundingAreas: z.array(z.string()).default([]),
      featuredServiceAreas: z.array(z.string()).optional(),
      coverageByCounty: z
        .array(
          z.object({
            county: z.string(),
            cities: z.array(
              z.object({
                name: z.string(),
                zips: z.array(z.string()),
              }),
            ),
          }),
        )
        .optional(),
    }),
});

const services = defineCollection({
  type: 'data',
  schema: () =>
    z.object({
      name: z.string(),
      slug: z.string(),
      short: z.string(),
      description: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().int().optional(),
      ctaLabel: z.string().optional(),
      ctaHref: z.string().optional(),
      icon: z.string().optional(),
    }),
});

export const collections = {
  blog,
  locations,
  services,
};
