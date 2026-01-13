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

interface HistoryState {
  tenders: Tender[]
  timestamp: number
}

interface TenderState {
  tenders: Tender[]
  sortType: SortType
  history: HistoryState[]
  historyIndex: number
  moveTender: (tenderId: string, newStatus: TenderStatus) => void
  addTender: (tender: Omit<Tender, 'id'>) => void
  setTenders: (tenders: Tender[]) => void
  setSortType: (sortType: SortType) => void
  getSortedTenders: () => Tender[]
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
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

const MAX_HISTORY_SIZE = 50

export const useTenderStore = create<TenderState>((set, get) => ({
  tenders: initialTenders,
  sortType: null,
  history: [],
  historyIndex: -1,
  canUndo: () => {
    const { history, historyIndex } = get()
    // Can undo if we have at least 2 states in history (initial + at least 1 change)
    return history.length >= 2 && historyIndex > 0
  },
  canRedo: () => {
    const { history, historyIndex } = get()
    // Can redo if we have history and we're not at the last state
    return history.length > 0 && historyIndex < history.length - 1
  },
  moveTender: (tenderId, newStatus) => {
    const { tenders, history, historyIndex } = get()
    const currentTender = tenders.find((t) => t.id === tenderId)

    // Don't add to history if status hasn't changed
    if (currentTender?.status === newStatus) {
      return
    }

    // Create new state after the change
    const newTenders = tenders.map((tender) =>
      tender.id === tenderId ? { ...tender, status: newStatus } : tender
    )

    // Initialize history if empty or invalid index
    let newHistory: HistoryState[]

    if (history.length === 0 || historyIndex < 0) {
      // First time: save current state as initial state
      newHistory = [
        {
          tenders: tenders.map((t) => ({ ...t })),
          timestamp: Date.now(),
        },
      ]
    } else {
      // Normal case: slice history up to current index
      newHistory = history.slice(0, historyIndex + 1)
    }

    // Add the new state to history
    newHistory.push({
      tenders: newTenders.map((t) => ({ ...t })),
      timestamp: Date.now(),
    })

    // Limit history size
    let finalHistoryIndex = newHistory.length - 1
    if (newHistory.length > MAX_HISTORY_SIZE) {
      newHistory.shift()
      finalHistoryIndex = newHistory.length - 1
    }

    persistTenderStatus(tenderId, newStatus)
    set({
      tenders: newTenders,
      history: newHistory,
      historyIndex: finalHistoryIndex,
    })
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
  setTenders: (tenders) => {
    // Initialize history with current state as the first entry
    // This allows undo to work from the first move
    set({
      tenders,
      history: [
        {
          tenders: tenders.map((t) => ({ ...t })),
          timestamp: Date.now(),
        },
      ],
      historyIndex: 0,
    })
  },
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
  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return

    const previousState = history[historyIndex - 1]
    if (previousState) {
      // Restore previous state and update persisted statuses
      previousState.tenders.forEach((tender) => {
        persistTenderStatus(tender.id, tender.status)
      })

      set({
        tenders: previousState.tenders.map((t) => ({ ...t })),
        historyIndex: historyIndex - 1,
      })
    }
  },
  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return

    const nextState = history[historyIndex + 1]
    if (nextState) {
      // Restore next state and update persisted statuses
      nextState.tenders.forEach((tender) => {
        persistTenderStatus(tender.id, tender.status)
      })

      set({
        tenders: nextState.tenders.map((t) => ({ ...t })),
        historyIndex: historyIndex + 1,
      })
    }
  },
}))
