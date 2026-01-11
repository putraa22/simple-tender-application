import { create } from 'zustand'
import { persistTenderStatus } from '../utils/tenderStatusPersistence'

export type TenderStatus = 'draft' | 'ongoing' | 'completed'

export type SortType =
  | 'most-products'
  | 'least-products'
  | 'most-vendors'
  | 'least-vendors'
  | 'oldest-date'
  | 'latest-date'
  | null

export interface Tender {
  id: string
  title: string
  description?: string
  productsCount: number
  participantsCount: number
  date: string
  amount?: string
  attachmentsCount?: number
  commentsCount?: number
  status: TenderStatus
}

interface TenderState {
  tenders: Tender[]
  sortType: SortType
  moveTender: (tenderId: string, newStatus: TenderStatus) => void
  addTender: (tender: Omit<Tender, 'id'>) => void
  setTenders: (tenders: Tender[]) => void
  setSortType: (sortType: SortType) => void
  getSortedTenders: () => Tender[]
}

const initialTenders: Tender[] = []

const parseDate = (dateStr: string): Date => {
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date
  }

  const months: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  }

  const parts = dateStr.toLowerCase().split(' ')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = months[parts[1].substring(0, 3)]
    const year = parseInt(parts[2], 10)
    return new Date(year, month, day)
  }
  return new Date(0)
}

export const useTenderStore = create<TenderState>((set, get) => ({
  tenders: initialTenders,
  sortType: null,
  moveTender: (tenderId, newStatus) => {
    persistTenderStatus(tenderId, newStatus)
    set((state) => ({
      tenders: state.tenders.map((tender) =>
        tender.id === tenderId ? { ...tender, status: newStatus } : tender
      ),
    }))
  },
  addTender: (tender) =>
    set((state) => ({
      tenders: [
        ...state.tenders,
        {
          ...tender,
          id: Date.now().toString(),
        },
      ],
    })),
  setTenders: (tenders) => set({ tenders }),
  setSortType: (sortType) => set({ sortType }),
  getSortedTenders: () => {
    const { tenders, sortType } = get()
    if (!sortType) return tenders

    const sorted = [...tenders]

    switch (sortType) {
      case 'most-products':
        return sorted.sort((a, b) => b.productsCount - a.productsCount)
      case 'least-products':
        return sorted.sort((a, b) => a.productsCount - b.productsCount)
      case 'most-vendors':
        return sorted.sort((a, b) => b.participantsCount - a.participantsCount)
      case 'least-vendors':
        return sorted.sort((a, b) => a.participantsCount - b.participantsCount)
      case 'oldest-date':
        return sorted.sort(
          (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
        )
      case 'latest-date':
        return sorted.sort(
          (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
        )
      default:
        return tenders
    }
  },
}))
