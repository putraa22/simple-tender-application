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

const mapStatusFromApi = (status?: number): TenderStatus => {
  if (status === 1) return 'draft'
  if (status === 2) return 'ongoing'
  if (status === 3) return 'completed'
  return 'draft'
}

const determineStatus = (tender: TenderApiItem): TenderStatus => {
  if (tender.status !== undefined && tender.status !== null) {
    return mapStatusFromApi(tender.status)
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
