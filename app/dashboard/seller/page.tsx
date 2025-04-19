"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Edit, Eye, MessageCircle, Package, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { NewListingForm } from "@/components/new-listing-form"

type Listing = {
  id: string
  title: string
  price: number
  condition: string
  category: string
  image: string
  status: "active" | "reserved" | "sold"
  views: number
  chats: number
  createdAt: string
}

export default function SellerDashboard() {
  const router = useRouter()
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  const [listings, setListings] = useState<Listing[]>([])
  const [soldItems, setSoldItems] = useState<Listing[]>([])
  const [activeChats, setActiveChats] = useState<
    {
      id: string
      buyer: {
        id: string
        name: string
      }
      product: Listing
      lastMessage: string
      timestamp: string
      unread: number
    }[]
  >([])
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Redirect if not logged in or not a seller
    if (!user || (userRole !== "seller" && userRole !== null)) {
      router.push("/login")
      return
    }

    // Mock data - in a real app, this would come from an API
    const mockListings: Listing[] = Array.from({ length: 4 }, (_, i) => ({
      id: `listing-${i + 1}`,
      title: `Listing Item ${i + 1}`,
      price: Math.floor(Math.random() * 90) + 10,
      condition: ["New", "Like New", "Good", "Fair"][Math.floor(Math.random() * 4)],
      category: ["Books", "Tools", "Calculators", "Drafters"][Math.floor(Math.random() * 4)],
      image: "/placeholder.svg?height=200&width=300",
      status: ["active", "reserved", "active", "active"][i] as "active" | "reserved" | "sold",
      views: Math.floor(Math.random() * 50),
      chats: Math.floor(Math.random() * 5),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    }))

    const mockSoldItems: Listing[] = Array.from({ length: 2 }, (_, i) => ({
      id: `sold-${i + 1}`,
      title: `Sold Item ${i + 1}`,
      price: Math.floor(Math.random() * 90) + 10,
      condition: ["New", "Like New", "Good", "Fair"][Math.floor(Math.random() * 4)],
      category: ["Books", "Tools", "Calculators", "Drafters"][Math.floor(Math.random() * 4)],
      image: "/placeholder.svg?height=200&width=300",
      status: "sold",
      views: Math.floor(Math.random() * 50),
      chats: Math.floor(Math.random() * 5),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
    }))

    const mockChats = [
      {
        id: "chat-1",
        buyer: {
          id: "buyer-1",
          name: "Jordan Lee",
        },
        product: mockListings[0],
        lastMessage: "Is this still available?",
        timestamp: "10:30 AM",
        unread: 1,
      },
      {
        id: "chat-2",
        buyer: {
          id: "buyer-2",
          name: "Casey Kim",
        },
        product: mockListings[1],
        lastMessage: "Can you do ₹40 instead?",
        timestamp: "Yesterday",
        unread: 0,
      },
    ]

    setListings(mockListings)
    setSoldItems(mockSoldItems)
    setActiveChats(mockChats)
  }, [user, userRole, router])

  const handleDeleteListing = (id: string) => {
    setListingToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteListing = () => {
    if (listingToDelete) {
      setListings(listings.filter((listing) => listing.id !== listingToDelete))

      toast({
        title: "Listing deleted",
        description: "Your listing has been removed",
      })

      setIsDeleteDialogOpen(false)
      setListingToDelete(null)
    }
  }

  const handleMarkAsSold = (id: string) => {
    const listing = listings.find((item) => item.id === id)

    if (listing) {
      // Remove from active listings
      setListings(listings.filter((item) => item.id !== id))

      // Add to sold items
      const soldListing = { ...listing, status: "sold" as const }
      setSoldItems([soldListing, ...soldItems])

      toast({
        title: "Marked as sold",
        description: "Your listing has been marked as sold",
      })
    }
  }

  return (
    <div className="container py-8">
      <DashboardHeader
        title="Seller Dashboard"
        description="Manage your listings and track interest"
        action={{
          label: "Post New Item",
          href: "#new-listing",
        }}
      />

      <Tabs defaultValue="listings" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">My Listings</span>
          </TabsTrigger>
          <TabsTrigger value="sold" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Sold Items</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Active Chats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium">Active Listings ({listings.length})</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Post New Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post New Item</DialogTitle>
                  <DialogDescription>Fill out the details to list your item for sale</DialogDescription>
                </DialogHeader>
                <NewListingForm />
              </DialogContent>
            </Dialog>
          </div>

          {listings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No active listings</h3>
                <p className="mt-2 text-sm text-muted-foreground">Start selling by posting your first item</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">Post New Item</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Post New Item</DialogTitle>
                      <DialogDescription>Fill out the details to list your item for sale</DialogDescription>
                    </DialogHeader>
                    <NewListingForm />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute right-2 top-2">
                      <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                        {listing.status === "active" ? "Active" : "Reserved"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {listing.category}
                        </Badge>
                        <h3 className="font-medium line-clamp-1">{listing.title}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-primary">₹{listing.price}</span>
                          <span className="text-sm text-muted-foreground">{listing.condition}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/product/${listing.id}`}>View Listing</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/seller/edit/${listing.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Listing
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMarkAsSold(listing.id)}>
                            <Package className="mr-2 h-4 w-4" />
                            Mark as Sold
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Listing
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{listing.chats} chats</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          {soldItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No sold items</h3>
                <p className="mt-2 text-sm text-muted-foreground">Items you mark as sold will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {soldItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    <div className="absolute right-2 top-2">
                      <Badge variant="secondary">Sold</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-primary">₹{item.price}</span>
                      <span className="text-sm text-muted-foreground">{item.condition}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{item.views} views</span>
                      </div>
                      <div>
                        <span>Sold on {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chats" className="mt-6">
          {activeChats.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No active chats</h3>
                <p className="mt-2 text-sm text-muted-foreground">Conversations with buyers will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeChats.map((chat) => (
                <Card key={chat.id} className="overflow-hidden">
                  <Link href={`/chat/${chat.buyer.id}?product=${chat.product.id}`}>
                    <CardContent className="flex gap-4 p-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={chat.product.image || "/placeholder.svg"}
                          alt={chat.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium line-clamp-1">{chat.buyer.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {chat.product.title} - ₹{chat.product.price}
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm line-clamp-1">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <Badge variant="default" className="ml-2">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteListing}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
