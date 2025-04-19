"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronRight, ImageIcon, Package, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isOffer?: boolean
  offerAmount?: number
  offerStatus?: "pending" | "accepted" | "rejected"
}

type Product = {
  id: string
  title: string
  price: number
  image: string
}

type ChatUser = {
  id: string
  name: string
  isOnline: boolean
}

export default function ChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [otherUser, setOtherUser] = useState<ChatUser | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [offerAmount, setOfferAmount] = useState("")
  const [showOfferInput, setShowOfferInput] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userId = params.userId as string
  const productId = searchParams.get("product")

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push("/login")
      return
    }

    // Mock data - in a real app, this would come from an API
    const mockUser: ChatUser = {
      id: userId,
      name: "Alex Johnson",
      isOnline: true,
    }

    const mockProduct: Product = {
      id: productId || "product-1",
      title: "Scientific Calculator TI-84",
      price: 45,
      image: "/placeholder.svg?height=200&width=300",
    }

    const mockMessages: Message[] = [
      {
        id: "msg-1",
        senderId: userId,
        text: "Hi there! Is this calculator still available?",
        timestamp: new Date(Date.now() - 3600000 * 2),
      },
      {
        id: "msg-2",
        senderId: "current-user",
        text: "Yes, it's still available!",
        timestamp: new Date(Date.now() - 3600000 * 1.5),
      },
      {
        id: "msg-3",
        senderId: userId,
        text: "Great! Does it come with batteries?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "msg-4",
        senderId: "current-user",
        text: "Yes, it does. It's in great condition and I've barely used it.",
        timestamp: new Date(Date.now() - 3600000 * 0.5),
      },
      {
        id: "msg-5",
        senderId: userId,
        isOffer: true,
        offerAmount: 40,
        offerStatus: "pending",
        text: "Would you accept ₹40 for it?",
        timestamp: new Date(Date.now() - 60000),
      },
    ]

    setOtherUser(mockUser)
    setProduct(mockProduct)
    setMessages(mockMessages)
  }, [user, userId, productId, router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault()

    if (!offerAmount.trim() || isNaN(Number(offerAmount))) return

    const newOffer: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      text: `I'd like to offer ₹${offerAmount} for this item.`,
      timestamp: new Date(),
      isOffer: true,
      offerAmount: Number(offerAmount),
      offerStatus: "pending",
    }

    setMessages([...messages, newOffer])
    setOfferAmount("")
    setShowOfferInput(false)
  }

  const handleAcceptOffer = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, offerStatus: "accepted" } : msg)))

    toast({
      title: "Offer accepted",
      description: "You've accepted the offer. Arrange a meeting to complete the transaction.",
    })
  }

  const handleRejectOffer = (messageId: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, offerStatus: "rejected" } : msg)))
  }

  if (!otherUser || !product) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="flex animate-pulse flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="mt-4 h-6 w-32 rounded-md bg-muted"></div>
          <div className="mt-2 h-4 w-24 rounded-md bg-muted"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Chat header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={user?.id === "current-user" ? "/dashboard/buyer" : "/dashboard/seller"}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                {otherUser.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                )}
              </div>
              <div>
                <h2 className="font-medium">{otherUser.name}</h2>
                <p className="text-xs text-muted-foreground">{otherUser.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" asChild>
              <Link href={`/product/${product.id}`} className="flex items-center gap-1">
                <span>View Product</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Product info */}
      <div className="border-b bg-muted/30">
        <div className="container py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-md">
              <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-1">{product.title}</h3>
              <p className="text-sm font-bold text-primary">₹{product.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === "current-user"

            return (
              <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  } ${message.isOffer ? "w-full sm:w-80" : ""}`}
                >
                  {message.isOffer ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium">Price Offer</span>
                      </div>
                      <p className="text-lg font-bold">₹{message.offerAmount}</p>
                      <p className="text-sm">{message.text}</p>

                      {message.offerStatus === "pending" && !isCurrentUser && (
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" className="w-full" onClick={() => handleAcceptOffer(message.id)}>
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleRejectOffer(message.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      {message.offerStatus === "accepted" && (
                        <Badge variant="default" className="mt-1">
                          Accepted
                        </Badge>
                      )}

                      {message.offerStatus === "rejected" && (
                        <Badge variant="outline" className="mt-1">
                          Declined
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                  <p
                    className={`mt-1 text-right text-xs ${
                      isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Offer input */}
      {showOfferInput && (
        <div className="border-t bg-background p-4">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSendOffer} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="Enter offer amount"
                  className="pl-7"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <Button type="submit">Send Offer</Button>
              <Button type="button" variant="outline" onClick={() => setShowOfferInput(false)}>
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="flex-shrink-0"
              onClick={() => setShowOfferInput(!showOfferInput)}
            >
              <Package className="h-5 w-5" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
