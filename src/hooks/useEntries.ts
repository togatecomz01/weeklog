import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type BadgeType = 'normal' | 'important' | 'urgent'

export interface Entry {
  id: number
  week: string
  priority: BadgeType
  content: string
  week_year: number
  week_month: number
  week_number: number
  department: string
  title: string
  completed_work: string
  ongoing_work: string
  next_week_plan: string
  notes: string
  created_at: string
}

const PAGE_SIZE = 3

const PRIORITY_MAP: Record<string, BadgeType> = {
  '보통': 'normal',
  '중요': 'important',
  '긴급': 'urgent',
}

function toPreview(completed_work: string, ongoing_work: string) {
  const source = completed_work || ongoing_work
  if (!source) return '등록된 업무 내용이 없습니다.'
  const lines = source.split('\n').map((s) => s.trim()).filter(Boolean)
  return lines.slice(0, 3).map((line, i) => `${i + 1}. ${line}`).join('\n')
}

function mapEntry(raw: any): Entry {
  return {
    ...raw,
    week: `${raw.week_month}월 ${raw.week_number}주`,
    priority: PRIORITY_MAP[raw.priority] ?? 'normal',
    content: toPreview(raw.completed_work, raw.ongoing_work),
  }
}

export function useEntries() {
  const { token } = useAuth()
  const [entries, setEntries] = useState<Entry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async (offset: number, append: boolean) => {
    if (!token) return
    append ? setLoadingMore(true) : setLoading(true)
    try {
      const res = await fetch(`/api/entries/me?limit=${PAGE_SIZE}&offset=${offset}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('불러오기 실패')
      const { entries: raw, total } = await res.json()
      const mapped = raw.map(mapEntry)
      setEntries((prev) => append ? [...prev, ...mapped] : mapped)
      setTotal(total)
    } catch (err: any) {
      setError(err.message)
    } finally {
      append ? setLoadingMore(false) : setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchEntries(0, false)
  }, [fetchEntries])

  function loadMore() {
    fetchEntries(entries.length, true)
  }

  const hasMore = entries.length < total

  return { entries, total, loading, loadingMore, error, hasMore, loadMore }
}
