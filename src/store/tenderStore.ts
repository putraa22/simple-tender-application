import { create } from 'zustand'

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
  setSortType: (sortType: SortType) => void
  getSortedTenders: () => Tender[]
}

// Mock data with varied values for testing sorting
const initialTenders: Tender[] = [
  {
    id: '1',
    title: 'IT Equipment Upgrade',
    description: 'Upgrade computers and networking equipment',
    productsCount: 15,
    participantsCount: 5,
    date: '28 Feb 2025',
    amount: 'Rp 200.000.000',
    attachmentsCount: 1,
    commentsCount: 0,
    status: 'draft',
  },
  {
    id: '2',
    title: 'Office Supplies Procurement',
    description: 'Annual procurement of office supplies for all departments',
    productsCount: 8,
    participantsCount: 2,
    date: '31 Jan 2025',
    amount: 'Rp 50.000.000',
    attachmentsCount: 2,
    commentsCount: 1,
    status: 'ongoing',
  },
  {
    id: '3',
    title: 'Building Maintenance Services',
    description: 'Annual maintenance contract for office building',
    productsCount: 12,
    participantsCount: 4,
    date: '31 Dec 2024',
    amount: 'Rp 100.000.000',
    attachmentsCount: 0,
    commentsCount: 0,
    status: 'completed',
  },
  {
    id: '4',
    title: 'Software License Renewal',
    description: 'Renewal of enterprise software licenses',
    productsCount: 20,
    participantsCount: 3,
    date: '15 Mar 2025',
    amount: 'Rp 150.000.000',
    attachmentsCount: 3,
    commentsCount: 2,
    status: 'draft',
  },
  {
    id: '5',
    title: 'Cleaning Services Contract',
    description: 'Monthly cleaning services for office building',
    productsCount: 5,
    participantsCount: 6,
    date: '10 Feb 2025',
    amount: 'Rp 30.000.000',
    attachmentsCount: 1,
    commentsCount: 0,
    status: 'ongoing',
  },
  {
    id: '6',
    title: 'Security System Installation',
    description: 'Installation of new security camera system',
    productsCount: 18,
    participantsCount: 4,
    date: '20 Jan 2025',
    amount: 'Rp 180.000.000',
    attachmentsCount: 2,
    commentsCount: 1,
    status: 'completed',
  },
]

// Helper function to parse date string (e.g., "28 Feb 2025")
const parseDate = (dateStr: string): Date => {
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
  moveTender: (tenderId, newStatus) =>
    set((state) => ({
      tenders: state.tenders.map((tender) =>
        tender.id === tenderId ? { ...tender, status: newStatus } : tender
      ),
    })),
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
