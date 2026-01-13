import { create } from 'zustand'

export interface Product {
  id: string
  name: string
  additionalInfo?: string
  desiredBrand?: string
  specifications?: string
  unitOfMeasurement: string
  quantity: number
  lastPrice: string
  paymentTerms: string
  leadTimeDays: number
}

export interface Vendor {
  id: string
  name: string
  email: string
  address?: string
  picName?: string
  phoneNumber?: string
  paymentTerms?: string
  deliveryTimeDays?: number
}

interface CreateTenderState {
  tenderId: number | null
  generalInfo: {
    tenderName: string
    date: string
    requesterName: string
    descriptions: string
  }
  products: Product[]
  vendors: Vendor[]
  isStarted: boolean
  setTenderId: (id: number | null) => void
  setGeneralInfo: (info: Partial<CreateTenderState['generalInfo']>) => void
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  addVendor: (vendor: Vendor) => void
  removeVendor: (vendorId: string) => void
  startTender: () => void
  reset: () => void
}

const initialState = {
  tenderId: null,
  generalInfo: {
    tenderName: 'Laptop',
    date: '',
    requesterName: '',
    descriptions: '',
  },
  products: [],
  vendors: [],
  isStarted: false,
}

export const useCreateTenderStore = create<CreateTenderState>((set) => ({
  ...initialState,
  setTenderId: (id) => set({ tenderId: id }),
  setGeneralInfo: (info) =>
    set((state) => ({
      generalInfo: { ...state.generalInfo, ...info },
    })),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  removeProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    })),
  addVendor: (vendor) =>
    set((state) => ({
      vendors: [...state.vendors, vendor],
    })),
  removeVendor: (vendorId) =>
    set((state) => ({
      vendors: state.vendors.filter((v) => v.id !== vendorId),
    })),
  startTender: () => set({ isStarted: true }),
  reset: () => set(initialState),
}))
