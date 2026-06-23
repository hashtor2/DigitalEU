import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCancellationGuide } from '@/lib/scan'
import type { CancellationGuide } from '@/lib/scan'

export default function CancellationGuidePage() {
  const { id } = useParams<{ id: string }>()
  const [guide, setGuide] = useState<CancellationGuide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGuide = async () => {
      if (!id) {
        setError('Guide not found')
        setLoading(false)
        return
      }

      const { guide: data, error: fetchError } = await getCancellationGuide(id)

      if (fetchError || !data) {
        setError(fetchError || 'Guide not found')
        setLoading(false)
        return
      }

      setGuide(data)
      setLoading(false)

      // Set meta tags
      document.title = data.title + ' — digitaleu.me'

      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', data.seo_meta_description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = data.seo_meta_description
        document.head.appendChild(meta)
      }

      // OG tags
      setOgMeta('og:title', data.title)
      setOgMeta('og:description', data.seo_meta_description)
      setOgMeta('og:image', data.og_image_url)
      setOgMeta('og:url', data.canonical_url)
      setOgMeta('og:type', 'article')

      // Canonical URL
      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', data.canonical_url)
      } else {
        const link = document.createElement('link')
        link.rel = 'canonical'
        link.href = data.canonical_url
        document.head.appendChild(link)
      }

      // JSON-LD: HowTo schema
      const howToSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: data.title,
        description: data.description,
        image: data.hero_image_url,
        step: data.how_to_cancel_steps.map((step) => ({
          '@type': 'HowToStep',
          position: step.step,
          name: step.title,
          text: step.description,
        })),
      }

      // JSON-LD: BreadcrumbList schema
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://scanner.digitaleu.me',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: 'https://scanner.digitaleu.me/cancel',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.title,
            item: data.canonical_url,
          },
        ],
      }

      // Inject JSON-LD scripts
      const howToScript = document.createElement('script')
      howToScript.type = 'application/ld+json'
      howToScript.textContent = JSON.stringify(howToSchema)
      document.head.appendChild(howToScript)

      const breadcrumbScript = document.createElement('script')
      breadcrumbScript.type = 'application/ld+json'
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema)
      document.head.appendChild(breadcrumbScript)
    }

    loadGuide()
  }, [id])

  const setOgMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (meta) {
      meta.setAttribute('content', content)
    } else {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      meta.setAttribute('content', content)
      document.head.appendChild(meta)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#1a2332]/70">Loading guide...</p>
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-lg border border-red-300 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-red-900">Guide not found</h2>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <a href="/cancel" className="inline-block text-sm text-[#c17a5c] hover:underline">
            Back to guides
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero section with responsive image */}
      <div className="rounded-lg overflow-hidden">
        <img
          src={guide.hero_image_url}
          alt={guide.title}
          className="w-full h-96 object-cover"
          srcSet={`${guide.hero_image_url}?w=640&h=400&fit=crop 640w, ${guide.hero_image_url}?w=1024&h=512&fit=crop 1024w, ${guide.hero_image_url}?w=1280&h=640&fit=crop 1280w`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
        />
      </div>

      {/* Header */}
      <div>
        <a href="/cancel" className="text-[#c17a5c] font-mono text-sm hover:underline mb-3 inline-block">
          ← Back to guides
        </a>
        <h1 className="text-4xl font-mono font-bold mb-3">{guide.title}</h1>
        <p className="text-[#1a2332]/70 text-lg">{guide.description}</p>
      </div>

      {/* Service info */}
      {guide.service && (
        <div className="rounded-lg border border-[#1a2332]/10 bg-white p-6">
          <div className="flex items-center gap-4">
            {guide.service.logo_url && (
              <img
                src={guide.service.logo_url}
                alt={guide.service.name}
                className="h-12 w-12 object-contain"
              />
            )}
            <div>
              <h3 className="font-mono font-semibold">{guide.service.name}</h3>
              <a
                href={guide.service.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#c17a5c] hover:underline"
              >
                Visit website →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-mono font-semibold">How to cancel</h2>
        <div className="space-y-4">
          {guide.how_to_cancel_steps.map((step) => (
            <div key={step.step} className="rounded-lg border border-[#1a2332]/10 bg-white p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c17a5c]/10">
                    <span className="font-mono font-bold text-[#c17a5c]">{step.step}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-mono font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-[#1a2332]/70">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* European alternative */}
      {guide.featured_eu_alternative && (
        <div className="rounded-lg border border-[#2d3e2d]/20 bg-[#2d3e2d]/5 p-6">
          <h3 className="font-mono font-semibold mb-2">Recommended European alternative</h3>
          <p className="text-[#1a2332]/70 mb-4">
            After cancelling, consider switching to <strong>{guide.featured_eu_alternative}</strong> for better privacy and data sovereignty.
          </p>
          <a
            href={`/cancel/${guide.featured_eu_alternative.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-[#2d3e2d] font-mono font-semibold hover:underline"
          >
            View guide for {guide.featured_eu_alternative} →
          </a>
        </div>
      )}

      {/* Next steps */}
      <div className="rounded-lg border border-[#1a2332]/10 bg-[#f9f7f2] p-6">
        <h3 className="font-mono font-semibold mb-4">Next steps after cancellation</h3>
        <ol className="space-y-3 text-[#1a2332]/70">
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c] flex-shrink-0">1</span>
            <span>Complete all cancellation steps above</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c] flex-shrink-0">2</span>
            <span>Set up your new account with a European provider</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c] flex-shrink-0">3</span>
            <span>Update your email address across all services you use</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c] flex-shrink-0">4</span>
            <span>Consider using our browser extension to auto-fill the new email</span>
          </li>
        </ol>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-6 border-t border-[#1a2332]/10">
        <a
          href="/cancel"
          className="px-6 py-2 rounded border border-[#1a2332]/20 font-mono font-semibold hover:bg-[#1a2332]/5 transition"
        >
          ← All guides
        </a>
        <a
          href="/"
          className="px-6 py-2 rounded bg-[#c17a5c] font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 transition"
        >
          Back to home
        </a>
      </div>
    </div>
  )
}
