import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { TabNavigation } from '../components/layout/TabNavigation'
import { ActionButtons } from '../components/layout/ActionButtons'
import { GeneralInformationTab } from '../components/create-tender/GeneralInformationTab'
import { ProductsTab } from '../components/create-tender/ProductsTab'
import { VendorsTab } from '../components/create-tender/VendorsTab'
import { OverviewTab } from '../components/create-tender/OverviewTab'
import { useCreateTenderStore } from '../store/createTenderStore'
import { useCreateProduct } from '../hooks/useCreateProduct'
import { useCreateTender } from '../hooks/useCreateTender'
import {
  transformProductToCreateRequest,
  formatDateToISO8601,
} from '../utils/tenderCreateTransform'
import { useTenders } from '../hooks/useTenders'

type TabId = 'general' | 'products' | 'vendors' | 'overview'

interface Tab {
  id: TabId
  label: string
}

const tabs: Tab[] = [
  { id: 'general', label: 'General Information' },
  { id: 'products', label: 'Products' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'overview', label: 'Overview' },
]

const getNextTab = (currentTab: TabId): TabId | null => {
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTab)
  if (currentIndex < tabs.length - 1) {
    return tabs[currentIndex + 1].id
  }
  return null
}

export default function CreateTender() {
  const navigate = useNavigate()
  const { refetch: refetchTenders } = useTenders()
  const { generalInfo, products, vendors, isStarted, setTenderId, reset } =
    useCreateTenderStore()
  const { createProduct, isLoading: isCreatingProduct } = useCreateProduct()
  const { createTender, isLoading: isCreatingTender } = useCreateTender()
  const [activeTab, setActiveTab] = useState<TabId>('general')

  const handleSave = async (): Promise<void> => {
    const nextTab = getNextTab(activeTab)

    if (activeTab === 'general') {
      if (!generalInfo.tenderName || !generalInfo.date) {
        return
      }
      if (nextTab) {
        setActiveTab(nextTab)
      }
    } else if (activeTab === 'products') {
      if (nextTab) {
        setActiveTab(nextTab)
      }
    } else if (activeTab === 'vendors') {
      if (nextTab) {
        setActiveTab(nextTab)
      }
    } else if (activeTab === 'overview') {
      if (isStarted) {
        reset()
        navigate('/')
      }
    }
  }

  const handleStartTender = async (): Promise<void> => {
    const tenderRequest = {
      name: generalInfo.tenderName,
      date: formatDateToISO8601(generalInfo.date),
      requester_name: generalInfo.requesterName,
      description: generalInfo.descriptions,
      total_participant: vendors.length,
      total_product: products.length,
    }

    const result = await createTender(tenderRequest)
    if (result) {
      setTenderId(result.id)

      if (products.length > 0) {
        for (const product of products) {
          const productRequest = transformProductToCreateRequest(product)
          await createProduct(result.id, productRequest)
        }
      }

      const { startTender } = useCreateTenderStore.getState()
      startTender()
    }
  }

  const handleFinishTender = async (): Promise<void> => {
    await refetchTenders()
    reset()
    navigate('/')
  }

  const handleBack = (): void => {
    navigate('/')
  }

  const handleTabChange = (tabId: string): void => {
    if (tabs.some((tab) => tab.id === tabId)) {
      setActiveTab(tabId as TabId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <p className="text-sm text-gray-500">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </p>
              <h1 className="text-xl font-semibold text-gray-800">Tender</h1>
            </div>
          </div>
          {activeTab === 'overview' && isStarted ? (
            <ActionButtons
              onSave={handleFinishTender}
              saveLabel="Finish Tender"
              saveVariant="green"
              isLoading={isCreatingTender}
            />
          ) : (
            <ActionButtons
              onSave={handleSave}
              isLoading={isCreatingTender || isCreatingProduct}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Tab Content */}
          {activeTab === 'general' && <GeneralInformationTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'vendors' && <VendorsTab />}
          {activeTab === 'overview' && (
            <OverviewTab
              onStartTender={handleStartTender}
              isLoading={isCreatingTender || isCreatingProduct}
            />
          )}
        </div>
      </div>
    </div>
  )
}
