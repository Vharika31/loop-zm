"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Bookmark, BookmarkCheck, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { RelatedProducts } from "@/components/related-products"

type Product = {
  id: string
  title: string
  description: string
  price: number
  condition: string
  category: string
  department: string
  seller: {
    id: string
    name: string
    department: string
    year: string
  }
  images: string[]
  createdAt: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockProduct: Product = {
      id: params.id as string,
      title: "Scientific Calculator TI-84 Plus",
      description:
        "Slightly used TI-84 Plus graphing calculator. Perfect for calculus, statistics, and engineering courses. All buttons work perfectly, and the screen has no scratches. Comes with batteries and a protective case. I've graduated and no longer need it.",
      price: 45,
      condition: "Like New",
      category: "Calculators",
      department: "Engineering",
      seller: {
        id: "seller-123",
        name: "Alex Johnson",
        department: "Mechanical Engineering",
        year: "4",
      },
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      createdAt: "2023-09-15T10:30:00Z",
    }

    setProduct(mockProduct)
    setLoading(false)
  }, [params.id])

  const handleWishlist = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsWishlisted(!isWishlisted)

    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted
        ? "The item has been removed from your wishlist"
        : "The item has been added to your wishlist",
    })
  }

  const handleReserve = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reserve items",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    toast({
      title: "Item reserved",
      description: "The seller has been notified of your interest",
    })
  }

  const handleChat = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to chat with sellers",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    router.push(`/chat/${product?.seller.id}?product=${product?.id}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out this ${product?.title} on LOOP!`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex animate-pulse flex-col gap-8 md:flex-row">
          <div className="h-96 w-full rounded-lg bg-muted md:w-1/2"></div>
          <div className="flex w-full flex-col gap-4 md:w-1/2">
            <div className="h-8 w-3/4 rounded-md bg-muted"></div>
            <div className="h-6 w-1/4 rounded-md bg-muted"></div>
            <div className="h-24 w-full rounded-md bg-muted"></div>
            <div className="h-12 w-full rounded-md bg-muted"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/browse">Browse Listings</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" className="mb-6 flex items-center gap-1" asChild>
        <Link href="/browse">
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product images */}
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <div className="mt-4 flex justify-center gap-2">
            {product.images.map((image, index) => (
              <div key={index} className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border">
                <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-primary">{product.title}</h1>
              <p className="mt-1 text-xl font-bold">₹{product.price}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleWishlist}>
              {isWishlisted ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Condition:</span>
              <span className="text-sm">{product.condition}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Department:</span>
              <span className="text-sm">{product.department}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h2 className="font-medium">Description</h2>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
          </div>

          <Separator className="my-4" />

          <div>
            <h2 className="font-medium">Seller Information</h2>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-sm font-medium">{product.seller.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{product.seller.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.seller.department}, Year {product.seller.year}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleReserve}>
                Reserve Now
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleChat}>
                <MessageCircle className="h-4 w-4" />
                Chat with Seller
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-primary">Related Listings</h2>
        <p className="text-muted-foreground">You might also be interested in these items</p>
        <div className="mt-6">
          <RelatedProducts category={product.category} currentProductId={product.id} />
        </div>
      </div>
    </div>
  )
}
