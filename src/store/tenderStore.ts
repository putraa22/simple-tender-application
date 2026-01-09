import { create } from 'zustand'

export type TenderStatus = 'draft' | 'ongoing' | 'completed'

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
  moveTender: (tenderId: string, newStatus: TenderStatus) => void
  addTender: (tender: Omit<Tender, 'id'>) => void
}

// Mock data
const initialTenders: Tender[] = [
  {
    id: '1',
    title: 'IT Equipment Upgrade',
    description: 'Upgrade computers and networking equipment',
    productsCount: 9,
    participantsCount: 3,
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
    productsCount: 9,
    participantsCount: 3,
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
    productsCount: 9,
    participantsCount: 3,
    date: '31 Dec 2024',
    amount: 'Rp 100.000.000',
    attachmentsCount: 0,
    commentsCount: 0,
    status: 'completed',
  },
]

export const useTenderStore = create<TenderState>((set) => ({
  tenders: initialTenders,
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
}))
