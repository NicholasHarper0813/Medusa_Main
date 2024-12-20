import { NextRequest, NextResponse } from "next/server"
import { notFound } from "next/navigation"
import { initialize as initializeProductModule } from "@medusajs/product"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { ProductCollectionDTO, ProductDTO } from "@medusajs/types/dist/product"
import { IPricingModuleService } from "@medusajs/types"
import { getPricesByPriceSetId } from "@lib/util/get-prices-by-price-set-id"

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }) 
{
  const productService = await initializeProductModule()
  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const collections = await productService.listCollections()
  const collectionsByHandle = new Map<string, ProductCollectionDTO>()
  const { page, limit } = searchParams
  const { handle } = params

  for (const collection of collections) 
  {
    collectionsByHandle.set(collection.handle, collection)
  }

  const collection = collectionsByHandle.get(handle)
  if (!collection) 
  {
    return notFound()
  }
  
  const 
  {
    rows: products,
    metadata: { count },
  } = await getProductsByCollectionId(collection.id, searchParams)
  const publishedProducts: ProductDTO[] = products.filter(
    (product) => product.status === "published"
  )
  const nextPage = parseInt(page) + parseInt(limit)
  return NextResponse.json({
    collections: [collection],
    response: {
      products: publishedProducts,
      count,
    },
    nextPage: count > nextPage ? nextPage : null,
  })
}

async function getProductsByCollectionId(
  collection_id: string,
  params: Record<string, any>
): Promise<{ rows: ProductDTO[]; metadata: Record<string, any> }> {
  let { currency_code } = params
  currency_code = currency_code && currency_code.toUpperCase()
  const { query, modules } = await MedusaApp({
    modulesConfig: {
      [Modules.PRODUCT]: true,
      [Modules.PRICING]: true,
    },
    sharedResourcesConfig: 
    {
      database: { clientUrl: process.env.POSTGRES_URL },
    },
  })

  const filters = 
  {
    take: parseInt(params.limit) || 100,
    skip: parseInt(params.offset) || 0,
    filters: {
      collection_id: [collection_id],
    },
    currency_code,
  }

  const productsQuery = `#graphql
    query($filters: Record, $take: Int, $skip: Int) {
      products(filters: $filters, take: $take, skip: $skip) {
        id
        title
        handle
        tags
        status
        collection
        collection_id
        thumbnail
        images 
        {
          url
          alt_text
          id
        }
        options
        {
          id
          value
          title
        }
        variants 
        {
          id
          title
          created_at
          updated_at
          thumbnail
          inventory_quantity
          material
          weight
          length
          height
          width
          options 
          {
            id
            value
            title
          }
          price 
          {
            price_set 
            {
              id
            }
          }
        }
      }
    }`

  const { rows, metadata } = await query(productsQuery, filters)
  const productsWithPrices = await getPricesByPriceSetId({
    products: rows,
    currency_code,
    pricingService: modules.pricingService as unknown as IPricingModuleService,
  })
  
  return 
  {
    rows: productsWithPrices,
    metadata,
  }
}
