import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const locales = ['fr', 'en']
  
  // Static pages
  const staticPages = ['', '/about', '/projects', '/contact']
  
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  )

  // Dynamic project pages
  let projectEntries: MetadataRoute.Sitemap = []
  
  try {
    const supabase = await createClient()
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, created_at')
      .order('created_at', { ascending: false })

    if (projects) {
      projectEntries = locales.flatMap((locale) =>
        projects.map((project) => ({
          url: `${baseUrl}/${locale}/projects/${project.slug}`,
          lastModified: new Date(project.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      )
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  return [...staticEntries, ...projectEntries]
}
