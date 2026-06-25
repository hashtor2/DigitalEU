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

      setOgMeta('og:title', data.title)
      setOgMeta('og:description', data.seo_meta_description)
      setOgMeta('og:image', data.og_image_url)
      setOgMeta('og:url', data.canonical_url)
      setOgMeta('og:type', 'article')

      const canonical = document.querySelector('link[rel="canonical"]')
      if (canonical) {
        canonical.setAttribute('href', data.canonical_url)
      } else {
        const link = document.createElement('link')
        link.rel = 'canonical'
        link.href = data.canonical_url
        document.head.appendChild(link)
      }

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

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://scanner.digitaleu.me' },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://scanner.digitaleu.me/cancel' },
          { '@type': 'ListItem', position: 3, name: data.title, item: data.canonical_url },
        ],
      }

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
          <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary">Loading guide...</p>
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-sm border border-error/30 bg-error/10 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-error">Guide not found</h2>
          <p className="text-sm text-error/80 mb-4">{error}</p>
          <a href="/scanner/cancel" className="inline-block text-sm text-accent hover:underline">
            Back to guides
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero image */}
      <div className="rounded-sm overflow-hidden">
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
        <a href="/scanner/cancel" className="text-accent font-mono text-sm hover:underline mb-3 inline-block">
          ← Back to guides
        </a>
        <h1 className="text-4xl font-mono font-bold mb-3 text-text-primary dark:text-dark-text-primary">{guide.title}</h1>
        <p className="text-text-secondary dark:text-dark-text-secondary text-lg">{guide.description}</p>
      </div>

      {/* Service info */}
      {guide.service && (
        <div className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6">
          <div className="flex items-center gap-4">
            {guide.service.logo_url && (
              <img src={guide.service.logo_url} alt={guide.service.name} className="h-12 w-12 object-contain" />
            )}
            <div>
              <h3 className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">{guide.service.name}</h3>
              <a href={guide.service.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
                Visit website →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-mono font-semibold text-text-primary dark:text-dark-text-primary">How to cancel</h2>
        <div className="space-y-4">
          {guide.how_to_cancel_steps.map((step) => (
            <div key={step.step} className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <span className="font-mono font-bold text-accent">{step.step}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-mono font-semibold text-lg mb-2 text-text-primary dark:text-dark-text-primary">{step.title}</h3>
                  <p className="text-text-secondary dark:text-dark-text-secondary">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* European alternative */}
      {guide.featured_eu_alternative && (
        <div className="rounded-sm border border-accent/20 bg-accent/5 p-6">
          <h3 className="font-mono font-semibold mb-2 text-text-primary dark:text-dark-text-primary">Recommended European alternative</h3>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            After cancelling, consider switching to <strong>{guide.featured_eu_alternative}</strong> for better privacy and data sovereignty.
          </p>
          <a href={`/cancel/${guide.featured_eu_alternative.toLowerCase().replace(/\s+/g, '-')}`} className="text-accent font-mono font-semibold hover:underline">
            View guide for {guide.featured_eu_alternative} →
          </a>
        </div>
      )}

      {/* Next steps */}
      <div className="rounded-sm border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
        <h3 className="font-mono font-semibold mb-4 text-text-primary dark:text-dark-text-primary">Next steps after cancellation</h3>
        <ol className="space-y-3 text-text-secondary dark:text-dark-text-secondary">
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent flex-shrink-0">1</span>
            <span>Complete all cancellation steps above</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent flex-shrink-0">2</span>
            <span>Set up your new account with a European provider</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent flex-shrink-0">3</span>
            <span>Update your email address across all services you use</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-accent flex-shrink-0">4</span>
            <span>Consider using our browser extension to auto-fill the new email</span>
          </li>
        </ol>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between pt-6 border-t border-border dark:border-dark-border">
        <a href="/scanner/cancel" className="px-6 py-2 rounded-sm border border-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-mono font-semibold hover:bg-border dark:hover:bg-dark-border transition">
          ← All guides
        </a>
        <a href="/" className="px-6 py-2 rounded-sm bg-accent font-mono font-semibold text-white hover:bg-accent-hover transition">
          Back to home
        </a>
      </div>
    </div>
  )
}
