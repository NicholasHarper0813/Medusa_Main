import { NextRequest, NextResponse } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"
import { notFound } from "next/navigation"

export async function GET(request: NextRequest) {
  const productService = await initializeProductModule()
  const { offset, limit } = Object.fromEntries(request.nextUrl.searchParams)
  const [product_categories, count] = await productService
    .listAndCountCategories(
      {},
      {
        select: ["id", "handle", "name", "description", "parent_category"],
        relations: ["category_children"],
        skip: parseInt(offset) || 0,
        take: parseInt(limit) || 100,
      }
    )
    .catch((e) => {
      return notFound()
    })

  return NextResponse.json({
    product_categories,
    count,
  })
}
