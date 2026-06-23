import { PRODUCT_RESEARCH } from './research'
import { PRODUCTS } from './products'

export interface LibraryStudy {
  title: string
  authors: string
  journal: string
  year: number
  pmid?: string
  url: string
  summary: string
  products: { name: string; slug: string; category: string }[]
  categories: string[]
}

// Build the research library by deduplicating studies across products
function buildResearchLibrary(): LibraryStudy[] {
  const studyMap = new Map<string, LibraryStudy>()

  // Iterate through all product research
  Object.entries(PRODUCT_RESEARCH).forEach(([productSlug, studies]) => {
    // Find the product details
    const product = PRODUCTS.find(p => p.slug === productSlug)
    if (!product) return

    // Process each study for this product
    studies.forEach(study => {
      const existing = studyMap.get(study.url)

      if (existing) {
        // Study already exists - add this product to its list
        const productRef = { name: product.name, slug: product.slug, category: product.category }

        // Only add if not already in the list
        if (!existing.products.some(p => p.slug === product.slug)) {
          existing.products.push(productRef)
        }

        // Add category if not already present
        if (!existing.categories.includes(product.category)) {
          existing.categories.push(product.category)
        }
      } else {
        // New study - create entry
        studyMap.set(study.url, {
          title: study.title,
          authors: study.authors,
          journal: study.journal,
          year: study.year,
          pmid: study.pmid,
          url: study.url,
          summary: study.summary,
          products: [{ name: product.name, slug: product.slug, category: product.category }],
          categories: [product.category]
        })
      }
    })
  })

  // Convert map to array and sort by year (descending)
  return Array.from(studyMap.values()).sort((a, b) => b.year - a.year)
}

export const RESEARCH_LIBRARY = buildResearchLibrary()
