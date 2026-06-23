import { useState, useEffect } from 'react'
import type { Alternative } from '@digitaleu/shared'
import { ALTERNATIVES } from '@digitaleu/shared'

export interface DetectedAccount {
  serviceId: string
  service: Alternative
  status: 'selected' | 'in-progress' | 'complete'
}

export interface Report {
  id: string
  timestamp: number
  selectedServiceIds: string[]
  services: DetectedAccount[]
}

const REPORT_STORAGE_KEY = 'europa_report'

export function useReport() {
  const [report, setReport] = useState<Report | null>(null)

  // Load report from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(REPORT_STORAGE_KEY)
    if (stored) {
      try {
        setReport(JSON.parse(stored))
      } catch {
        console.warn('Failed to load report from sessionStorage')
      }
    }
  }, [])

  const createReport = (selectedServiceIds: string[]) => {
    const newReport: Report = {
      id: `report_${Date.now()}`,
      timestamp: Date.now(),
      selectedServiceIds,
      services: selectedServiceIds
        .map(id => ALTERNATIVES.find(a => a.id === id))
        .filter((a): a is Alternative => a !== undefined)
        .map(service => ({
          serviceId: service.id,
          service,
          status: 'complete' as const,
        })),
    }

    sessionStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(newReport))
    setReport(newReport)
    return newReport.id
  }

  const clearReport = () => {
    sessionStorage.removeItem(REPORT_STORAGE_KEY)
    setReport(null)
  }

  return {
    report,
    createReport,
    clearReport,
  }
}
