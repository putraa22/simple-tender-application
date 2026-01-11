import { STORAGE_KEYS } from '../constants/storage'
import type { TenderStatus } from '../store/tenderStore'

type TenderStatusMap = Record<string, TenderStatus>

/**
 * Get persisted tender statuses from localStorage
 */
export const getPersistedTenderStatuses = (): TenderStatusMap => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TENDER_STATUSES)
    if (!stored) return {}

    const parsed = JSON.parse(stored)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Save tender status to localStorage
 */
export const persistTenderStatus = (
  tenderId: string,
  status: TenderStatus
): void => {
  try {
    const statuses = getPersistedTenderStatuses()
    statuses[tenderId] = status
    localStorage.setItem(STORAGE_KEYS.TENDER_STATUSES, JSON.stringify(statuses))
  } catch (error) {
    console.error('Failed to persist tender status:', error)
  }
}

/**
 * Apply persisted statuses to tenders
 * Returns a new array with updated statuses where persisted
 */
export const applyPersistedStatuses = <
  T extends { id: string; status: TenderStatus },
>(
  tenders: T[]
): T[] => {
  const persistedStatuses = getPersistedTenderStatuses()

  return tenders.map((tender) => {
    const persistedStatus = persistedStatuses[tender.id]
    if (persistedStatus && persistedStatus !== tender.status) {
      return { ...tender, status: persistedStatus }
    }
    return tender
  })
}

/**
 * Clear persisted status for a specific tender
 */
export const clearPersistedTenderStatus = (tenderId: string): void => {
  try {
    const statuses = getPersistedTenderStatuses()
    delete statuses[tenderId]
    localStorage.setItem(STORAGE_KEYS.TENDER_STATUSES, JSON.stringify(statuses))
  } catch (error) {
    console.error('Failed to clear persisted tender status:', error)
  }
}

/**
 * Clear all persisted tender statuses
 */
export const clearAllPersistedTenderStatuses = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TENDER_STATUSES)
  } catch (error) {
    console.error('Failed to clear all persisted tender statuses:', error)
  }
}
