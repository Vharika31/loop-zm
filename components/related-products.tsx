"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

type Product = {
  id: string
  title: string
  price: number
  condition: string
  category: string
  image: string
}

export function RelatedProducts({
  category,
  currentProductId,
}: {
  category: string
  currentProductId: string
}) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockProducts: Product[] = Array.from({ length: 6 }, (_, i) => ({
      id: `related-${i + 1}`,
      title: `${category} Item ${i + 1}`,
      price: Math.floor(Math.random() * 90) + 10,
      condition: ["New", "Like New", "Good", "Fair"][Math.floor(Math.random() * 4)],
      category,
      image: "/placeholder.svg?height=200&width=300",
    }))

    // Filter out the current product
    const filtered = mockProducts.filter((product) => product.id !== currentProductId)
    setProducts(filtered)
  }, [category, currentProductId])

  if (products.length === 0) {
    return null
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
            <Link href={`/product/${product.id}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-medium line-clamp-1">{product.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">₹{product.price}</span>
                      <span className="text-sm text-muted-foreground">{product.condition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  )
}
