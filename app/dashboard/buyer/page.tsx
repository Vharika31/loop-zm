"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Bookmark, Clock, MessageCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"

type Item = {
  id: string
  title: string
  price: number
  condition: string
  category: string
  image: string
  seller: {
    id: string
    name: string
  }
}

export default function BuyerDashboard() {
  const router = useRouter()
  const { user, userRole } = useAuth()

  const [wishlist, setWishlist] = useState<Item[]>([])
  const [reserved, setReserved] = useState<Item[]>([])
  const [chats, setChats] = useState<
    {
      id: string
      seller: {
        id: string
        name: string
      }
      product: Item
      lastMessage: string
      timestamp: string
      unread: number
    }[]
  >([])
  const [transactions, setTransactions] = useState<
    {
      id: string
      product: Item
      status: "completed" | "cancelled"
      date: string
    }[]
  >([])

  useEffect(() => {
    // Redirect if not logged in or not a buyer
    if (!user || (userRole !== "buyer" && userRole !== null)) {
      router.push("/login")
      return
    }

    // Mock data - in a real app, this would come from an API
    const mockWishlist: Item[] = Array.from({ length: 3 }, (_, i) => ({
      id: `wishlist-${i + 1}`,
      title: `Wishlist Item ${i + 1}`,
      price: Math.floor(Math.random() * 90) + 10,
      condition: ["New", "Like New", "Good", "Fair"][Math.floor(Math.random() * 4)],
      category: ["Books", "Tools", "Calculators"][Math.floor(Math.random() * 3)],
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        id: `seller-${i + 1}`,
        name: `Seller ${i + 1}`,
      },
    }))

    const mockReserved: Item[] = Array.from({ length: 2 }, (_, i) => ({
      id: `reserved-${i + 1}`,
      title: `Reserved Item ${i + 1}`,
      price: Math.floor(Math.random() * 90) + 10,
      condition: ["New", "Like New", "Good", "Fair"][Math.floor(Math.random() * 4)],
      category: ["Books", "Tools", "Calculators"][Math.floor(Math.random() * 3)],
      image: "/placeholder.svg?height=200&width=300",
      seller: {
        id: `seller-${i + 10}`,
        name: `Seller ${i + 10}`,
      },
    }))

    const mockChats = [
      {
        id: "chat-1",
        seller: {
          id: "seller-1",
          name: "Alex Johnson",
        },
        product: mockWishlist[0],
        lastMessage: "Is this still available?",
        timestamp: "10:30 AM",
        unread: 0,
      },
      {
        id: "chat-2",
        seller: {
          id: "seller-2",
          name: "Sam Wilson",
        },
        product: mockReserved[0],
        lastMessage: "I can meet tomorrow at 2pm",
        timestamp: "Yesterday",
        unread: 2,
      },
    ]

    const mockTransactions = [
      {
        id: "transaction-1",
        product: {
          id: "completed-1",
          title: "Physics Textbook",
          price: 25,
          condition: "Good",
          category: "Books",
          image: "/placeholder.svg?height=200&width=300",
          seller: {
            id: "seller-5",
            name: "Jamie Smith",
          },
        },
        status: "completed" as const,
        date: "2023-10-15",
      },
      {
        id: "transaction-2",
        product: {
          id: "cancelled-1",
          title: "Lab Coat",
          price: 20,
          condition: "Like New",
          category: "Aprons",
          image: "/placeholder.svg?height=200&width=300",
          seller: {
            id: "seller-6",
            name: "Taylor Brown",
          },
        },
        status: "cancelled" as const,
        date: "2023-09-28",
      },
    ]

    setWishlist(mockWishlist)
    setReserved(mockReserved)
    setChats(mockChats)
    setTransactions(mockTransactions)
  }, [user, userRole, router])

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id))
  }

  const cancelReservation = (id: string) => {
    setReserved(reserved.filter((item) => item.id !== id))
  }

  return (
    <div className="container py-8">
      <DashboardHeader title="Buyer Dashboard" description="Manage your wishlist, reservations, and chats" />

      <Tabs defaultValue="wishlist" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </TabsTrigger>
          <TabsTrigger value="reserved" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Reserved</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wishlist" className="mt-6">
          {wishlist.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Bookmark className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground">Items you bookmark will appear here</p>
                <Button asChild className="mt-4">
                  <Link href="/browse">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
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
                    <div className="mt-4 flex gap-2">
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <Link href={`/product/${item.id}`}>View</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reserved" className="mt-6">
          {reserved.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No reserved items</h3>
                <p className="mt-2 text-sm text-muted-foreground">Items you reserve will appear here</p>
                <Button asChild className="mt-4">
                  <Link href="/browse">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reserved.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
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
                    <p className="mt-2 text-xs text-muted-foreground">Seller: {item.seller.name}</p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <Link href={`/chat/${item.seller.id}?product=${item.id}`}>Chat</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => cancelReservation(item.id)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chats" className="mt-6">
          {chats.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No active chats</h3>
                <p className="mt-2 text-sm text-muted-foreground">Start a conversation with a seller</p>
                <Button asChild className="mt-4">
                  <Link href="/browse">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {chats.map((chat) => (
                <Card key={chat.id} className="overflow-hidden">
                  <Link href={`/chat/${chat.seller.id}?product=${chat.product.id}`}>
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
                          <h3 className="font-medium line-clamp-1">{chat.seller.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{chat.product.title}</p>
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

        <TabsContent value="transactions" className="mt-6">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No transaction history</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your completed transactions will appear here</p>
                <Button asChild className="mt-4">
                  <Link href="/browse">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={transaction.product.image || "/placeholder.svg"}
                        alt={transaction.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium line-clamp-1">{transaction.product.title}</h3>
                        <Badge variant={transaction.status === "completed" ? "default" : "destructive"}>
                          {transaction.status === "completed" ? "Completed" : "Cancelled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Seller: {transaction.product.seller.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="font-medium text-primary">₹{transaction.product.price}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
