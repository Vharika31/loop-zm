"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

type Listing = {
  id: string
  title: string
  price: number
  condition: string
  category: string
  image: string
}

export function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockListings: Listing[] = [
      {
        id: "1",
        title: "Scientific Calculator TI-84",
        price: 45,
        condition: "Like New",
        category: "Calculators",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        title: "Engineering Drafting Kit",
        price: 30,
        condition: "Good",
        category: "Drafters",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        title: "Organic Chemistry Textbook",
        price: 25,
        condition: "Fair",
        category: "Books",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        title: "Lab Apron - Chemistry",
        price: 15,
        condition: "Excellent",
        category: "Aprons",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        title: "Soldering Iron Kit",
        price: 40,
        condition: "Good",
        category: "Tools",
        image: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "6",
        title: "Calculus 3 Lecture Notes",
        price: 10,
        condition: "Good",
        category: "Notes",
        image: "/placeholder.svg?height=200&width=300",
      },
    ]

    setListings(mockListings)
  }, [])

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {listings.map((listing) => (
          <CarouselItem key={listing.id} className="md:basis-1/2 lg:basis-1/3">
            <Link href={`/product/${listing.id}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {listing.category}
                    </Badge>
                    <h3 className="font-medium line-clamp-1">{listing.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">₹{listing.price}</span>
                      <span className="text-sm text-muted-foreground">{listing.condition}</span>
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
