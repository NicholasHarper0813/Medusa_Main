import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { ReactElement, ReactNode } from "react"
import { AppProps } from "next/app"
import { NextPage } from "next"

export type CollectionData = {
  id: string
  title: string
}

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type StoreNavData = {
  collections: CollectionData[]
  hasMoreCollections: boolean
  featuredProducts: PricedProduct[]
}

export type StoreProps<T extends unknown> = {
  page: {
    data: T
  }
}

export type SiteProps = {
  site: {
    navData: StoreNavData
  }
}

export type PrefetchedPageProps = {
  notFound: boolean
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout<P = {}, IP = P> = AppProps<P> & {
  Component: NextPageWithLayout<P, IP>
}

export type ProductPreviewType = {
  id: string
  title: string
  handle: string | null
  thumbnail: string | null
  price?: {
    calculated_price: string
    original_price: string
    difference: string
    price_type: "default" | "sale"
  }
}

export type InfiniteProductPage = {
  response: {
    products: PricedProduct[]
    count: number
  }
}
