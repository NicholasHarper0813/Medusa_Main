import { NextResponse, NextRequest } from "next/server"
import { initialize as initializeProductModule } from "@medusajs/product"

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, any> }
) 
{
  const { handle } = params
  const productService = await initializeProductModule()
  const products = await productService.list(
    { handle },
    {
      relations: [
        "variants",
        "variants.options",
        "tags",
        "options",
        "options.values",
        "images",
        "description",
        "collection",
        "status",
      ],
      take: 1,
    }
  )

  return NextResponse.json({ products })
}
