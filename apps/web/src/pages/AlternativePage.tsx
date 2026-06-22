import { useParams, Link } from "react-router-dom";
import { ALTERNATIVES, getAffiliateUrl, hasVerifiedAffiliate } from "@digitaleu/shared";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { COUNTRY_FLAGS } from "@/lib/flags";

export function AlternativePage() {
  const { id } = useParams<{ id: string }>();

  // Find the alternative
  const alternative = ALTERNATIVES.find((a) => a.id === id);

  if (!alternative) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-3xl px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">Alternative not found</h1>
            <p className="text-slate-400 mb-6">The alternative you're looking for doesn't exist.</p>
            <Link
              to="/directory"
              className="inline-block px-4 py-2 rounded bg-[#1a56db] text-white hover:bg-[#2563eb] transition"
            >
              ← Back to Directory
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const affiliateUrl = getAffiliateUrl(alternative.id, alternative.url);
  const hasAffiliate = hasVerifiedAffiliate(alternative.id);

  // Big Tech services this replaces
  const replacesServices = alternative.replaces || [];

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-400">
          <Link to="/directory" className="hover:text-slate-200 transition">
            Directory
          </Link>
          <span>/</span>
          <span className="text-slate-200">{alternative.name}</span>
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-start gap-6 mb-6">
            {/* Logo */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-white overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${alternative.url}&sz=64`}
                alt={alternative.name}
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            {/* Name + metadata */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{alternative.name}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>{COUNTRY_FLAGS[alternative.country] || ""} {alternative.country}</span>
                {alternative.dataLocation && (
                  <>
                    <span>·</span>
                    <span>📍 {alternative.dataLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {alternative.pricing && (
              <div className="rounded border border-[#30363d] bg-[#161b22] p-4">
                <p className="text-[11px] text-slate-500 uppercase font-mono mb-1">Pricing</p>
                <p className="text-sm text-slate-200">{alternative.pricing}</p>
              </div>
            )}
            {alternative.category && (
              <div className="rounded border border-[#30363d] bg-[#161b22] p-4">
                <p className="text-[11px] text-slate-500 uppercase font-mono mb-1">Category</p>
                <p className="text-sm text-slate-200 capitalize">
                  {alternative.category.replace("-", " ")}
                </p>
              </div>
            )}
            {alternative.dataLocation && (
              <div className="rounded border border-[#30363d] bg-[#161b22] p-4">
                <p className="text-[11px] text-slate-500 uppercase font-mono mb-1">Data Location</p>
                <p className="text-sm text-slate-200">{alternative.dataLocation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Description */}
        <div className="mb-10">
          <div className="prose prose-invert max-w-none">
            <p className="text-sm leading-relaxed text-slate-300">
              {alternative.longDescription || alternative.description}
            </p>
          </div>
        </div>

        {/* Features */}
        {alternative.features && alternative.features.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternative.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded border border-[#30363d] bg-[#161b22] p-4"
                >
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Replaces Section */}
        {replacesServices.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">
              Replaces {replacesServices.length === 1 ? "service" : "services"}
            </h2>
            <div className="space-y-2">
              {replacesServices.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded border border-orange-500/20 bg-orange-500/5 px-4 py-3"
                >
                  <span className="text-orange-400">→</span>
                  <span className="text-sm text-slate-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "Tested By Us" Links Section - ONLY OUTBOUND LINKS */}
        <div className="mb-10 rounded border border-emerald-500/30 bg-emerald-500/5 p-6">
          <h2 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center gap-2">
            <span>✓ Tested by us</span>
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            All outbound links on DigitalEU.me are carefully curated. Click below to visit {alternative.name}.
          </p>

          <div className="space-y-3">
            {/* Main action: Try It button */}
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg">
                Try {alternative.name} {hasAffiliate ? "(Affiliate link)" : ""}
              </Button>
            </a>

            {/* Related guides */}
            {alternative.relatedGuides && alternative.relatedGuides.length > 0 && (
              <div className="pt-3 border-t border-emerald-500/20">
                <p className="text-[11px] text-slate-500 uppercase font-mono mb-3">Related Guides</p>
                <div className="space-y-2">
                  {alternative.relatedGuides.map((guideId) => (
                    <Link
                      key={guideId}
                      to={`/guides/${guideId}`}
                      className="block px-4 py-2 rounded border border-[#30363d] bg-[#161b22] text-sm text-slate-300 hover:text-slate-100 hover:border-[#484f58] transition"
                    >
                      📖 How to migrate to {alternative.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy policy + links */}
            <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap gap-2">
              <a
                href={`${alternative.url}/privacy`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-slate-200 underline transition"
              >
                Privacy Policy
              </a>
              <span className="text-slate-600">·</span>
              <a
                href={alternative.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-slate-200 underline transition"
              >
                Official Website
              </a>
            </div>
          </div>
        </div>

        {/* Back to Directory */}
        <div className="text-center pt-6 border-t border-[#30363d]">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            ← Back to all alternatives
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
