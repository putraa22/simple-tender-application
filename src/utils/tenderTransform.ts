import type { TenderApiItem } from '../types/api'
import type { Tender, TenderStatus } from '../store/tenderStore'

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return dateString
  }
}

const determineStatus = (tender: TenderApiItem): TenderStatus => {
  const now = new Date()
  const tenderDate = new Date(tender.date)

  if (tenderDate > now) {
    return 'draft'
  }

  if (tenderDate <= now) {
    const daysDiff = Math.floor(
      (now.getTime() - tenderDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff > 30) {
      return 'completed'
    }

    return 'ongoing'
  }

  return 'draft'
}

export const transformTenderApiToTender = (
  apiTender: TenderApiItem
): Tender => {
  return {
    id: apiTender.id.toString(),
    title: apiTender.name,
    description: apiTender.description,
    productsCount: apiTender.total_product,
    participantsCount: apiTender.total_participant,
    date: formatDate(apiTender.date),
    status: determineStatus(apiTender),
  }
}

export const transformTenderListApiToTenders = (
  apiTenders: TenderApiItem[]
): Tender[] => {
  return apiTenders.map(transformTenderApiToTender)
}
