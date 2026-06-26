import { useRef, useState } from 'react'
import { getGdprTemplate, generateErasureLetter } from '@/lib/gdprTemplates'
import type { GdprTemplate } from '@/lib/gdprTemplates'
import type { EnrichedScanResult } from '@/lib/scan'

export function GdprGenerator({ results }: { results: EnrichedScanResult[] }) {
  const [selectedId, setSelectedId] = useState<string>(results[0]?.service_id ?? '')
  const [yourName, setYourName] = useState('')
  const [yourEmail, setYourEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const template: GdprTemplate | undefined = selectedId ? getGdprTemplate(selectedId) : undefined

  const letter =
    template && yourName && yourEmail
      ? generateErasureLetter({ template, yourName, yourEmail })
      : null

  const handleCopy = () => {
    if (!letter) return
    navigator.clipboard.writeText(letter).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const servicesWithTemplate = results.filter((r) => getGdprTemplate(r.service_id))
  const servicesWithout = results.filter((r) => !getGdprTemplate(r.service_id))
  const allServices = [...servicesWithTemplate, ...servicesWithout]

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">GDPR Erasure Generator</h2>
        <p className="text-sm text-slate-400 mt-1">
          Generate a ready-to-send GDPR Article 17 (right to erasure) letter for any detected service.
        </p>
      </div>

      <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-300">Select service</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-lg border border-[#2d4a6e] bg-[#0f2040] px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">-- choose a service --</option>
            {allServices.map((r) => {
              const hasTemplate = !!getGdprTemplate(r.service_id)
              return (
                <option key={r.service_id} value={r.service_id}>
                  {r.service?.name ?? r.service_id}
                  {hasTemplate ? '' : ' (no template)'}
                </option>
              )
            })}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-300">Your full name</label>
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full rounded-lg border border-[#2d4a6e] bg-[#0f2040] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-300">Your email address</label>
            <input
              type="email"
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full rounded-lg border border-[#2d4a6e] bg-[#0f2040] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {template && (
          <div className="rounded-lg border border-[#2d4a6e] bg-[#0f2040] p-4 space-y-1 text-xs text-slate-400">
            <p>
              <span className="text-slate-300 font-semibold">Legal entity: </span>
              {template.companyLegalName}
            </p>
            <p>
              <span className="text-slate-300 font-semibold">DPO email: </span>
              {template.dpoEmail}
            </p>
            {template.selfServeUrl && (
              <p>
                <span className="text-slate-300 font-semibold">Self-serve deletion: </span>
                <a
                  href={template.selfServeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {template.selfServeUrl}
                </a>
              </p>
            )}
          </div>
        )}

        {letter ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-300">Generated letter</p>
              <button
                onClick={handleCopy}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={letter}
              readOnly
              rows={20}
              className="w-full rounded-lg border border-[#2d4a6e] bg-[#0f2040] p-4 font-mono text-xs text-slate-300 resize-none focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500">
              Send this letter to{' '}
              <a href={`mailto:${template?.dpoEmail}`} className="text-emerald-400 hover:underline">
                {template?.dpoEmail}
              </a>
              . Under GDPR Art. 12(3), they must respond within 30 days.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">
            {!selectedId
              ? 'Select a service above to generate your letter.'
              : !template
              ? 'No template available for this service. Contact their privacy team directly.'
              : 'Fill in your name and email to generate the letter.'}
          </p>
        )}
      </div>
    </section>
  )
}
