"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, Flag, Package, Search, Shield, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"

type User = {
  id: string
  name: string
  email: string
  registrationNumber: string
  department: string
  year: string
  role: "buyer" | "seller"
  status: "active" | "warned" | "banned"
  joinedAt: string
}

type Listing = {
  id: string
  title: string
  price: number
  category: string
  seller: {
    id: string
    name: string
  }
  status: "active" | "flagged" | "removed"
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<User[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [flaggedListings, setFlaggedListings] = useState<Listing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false)

  useEffect(() => {
    // In a real app, check if user is admin
    if (!user) {
      router.push("/login")
      return
    }

    // Mock data - in a real app, this would come from an API
    const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      registrationNumber: `2023CS${String(i + 1).padStart(3, "0")}`,
      department: ["Computer Science", "Mechanical", "Electrical", "Civil"][Math.floor(Math.random() * 4)],
      year: String(Math.floor(Math.random() * 4) + 1),
      role: i % 3 === 0 ? "seller" : "buyer",
      status: ["active", "active", "active", "warned", "banned"][Math.floor(Math.random() * 5)] as
        | "active"
        | "warned"
        | "banned",
      joinedAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    }))

    const mockListings: Listing[] = Array.from({ length: 15 }, (_, i) => ({
      id: `listing-${i + 1}`,
      title: `Listing Item ${i + 1}`,
      price: Math.floor(Math.random() * 90) + 10,
      category: ["Books", "Tools", "Calculators", "Drafters"][Math.floor(Math.random() * 4)],
      seller: {
        id: `user-${Math.floor(Math.random() * 10) + 1}`,
        name: `User ${Math.floor(Math.random() * 10) + 1}`,
      },
      status: ["active", "active", "active", "active", "flagged"][Math.floor(Math.random() * 5)] as
        | "active"
        | "flagged"
        | "removed",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    }))

    setUsers(mockUsers)
    setListings(mockListings)
    setFlaggedListings(mockListings.filter((listing) => listing.status === "flagged"))
  }, [user, router])

  const handleUserAction = (action: "warn" | "ban" | "activate") => {
    if (!selectedUser) return

    const newStatus = action === "warn" ? "warned" : action === "ban" ? "banned" : "active"

    setUsers(
      users.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus as "active" | "warned" | "banned" } : u)),
    )

    toast({
      title: `User ${action === "activate" ? "activated" : action + "ed"}`,
      description: `${selectedUser.name} has been ${action === "activate" ? "activated" : action + "ed"}.`,
    })

    setIsUserDialogOpen(false)
  }

  const handleListingAction = (action: "remove" | "approve") => {
    if (!selectedListing) return

    const newStatus = action === "remove" ? "removed" : "active"

    setListings(
      listings.map((l) =>
        l.id === selectedListing.id ? { ...l, status: newStatus as "active" | "flagged" | "removed" } : l,
      ),
    )

    setFlaggedListings(flaggedListings.filter((l) => l.id !== selectedListing.id))

    toast({
      title: `Listing ${action === "remove" ? "removed" : "approved"}`,
      description: `The listing has been ${action === "remove" ? "removed" : "approved"}.`,
    })

    setIsListingDialogOpen(false)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-8">
      <DashboardHeader title="Admin Panel" description="Manage users, listings, and flagged content" />

      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users or listings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.role === "buyer").length} buyers, {users.filter((u) => u.role === "seller").length}{" "}
              sellers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.filter((l) => l.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">
              {listings.filter((l) => l.status === "flagged").length} flagged,{" "}
              {listings.filter((l) => l.status === "removed").length} removed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flaggedListings.length}</div>
            <p className="text-xs text-muted-foreground">Requires moderation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Listings</span>
          </TabsTrigger>
          <TabsTrigger value="flagged" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Flagged</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.registrationNumber}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role === "buyer" ? "Buyer" : "Seller"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "warned"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsUserDialogOpen(true)
                          }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell>₹{listing.price}</TableCell>
                      <TableCell>{listing.category}</TableCell>
                      <TableCell>{listing.seller.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            listing.status === "active"
                              ? "default"
                              : listing.status === "flagged"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedListing(listing)
                            setIsListingDialogOpen(true)
                          }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="mt-6">
          {flaggedListings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Shield className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No flagged content</h3>
                <p className="mt-2 text-sm text-muted-foreground">All content has been moderated</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {flaggedListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          Flagged
                        </Badge>
                        <h3 className="font-medium line-clamp-1">{listing.title}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-primary">₹{listing.price}</span>
                          <span className="text-sm text-muted-foreground">{listing.category}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">Seller: {listing.seller.name}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedListing(listing)
                          setIsListingDialogOpen(true)
                        }}
                      >
                        Review
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/product/${listing.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* User management dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User</DialogTitle>
            <DialogDescription>Review and manage user account</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Name</h3>
                  <p>{selectedUser.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p>{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Registration</h3>
                  <p>{selectedUser.registrationNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Department</h3>
                  <p>{selectedUser.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Role</h3>
                  <Badge variant="outline">{selectedUser.role === "buyer" ? "Buyer" : "Seller"}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "default"
                        : selectedUser.status === "warned"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Joined</h3>
                <p>{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-0">
            {selectedUser?.status === "active" && (
              <>
                <Button variant="outline" onClick={() => handleUserAction("warn")}>
                  Issue Warning
                </Button>
                <Button variant="destructive" onClick={() => handleUserAction("ban")}>
                  Ban User
                </Button>
              </>
            )}

            {selectedUser?.status === "warned" && (
              <>
                <Button variant="outline" onClick={() => handleUserAction("activate")}>
                  Remove Warning
                </Button>
                <Button variant="destructive" onClick={() => handleUserAction("ban")}>
                  Ban User
                </Button>
              </>
            )}

            {selectedUser?.status === "banned" && (
              <Button variant="default" onClick={() => handleUserAction("activate")}>
                Activate User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Listing management dialog */}
      <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Listing</DialogTitle>
            <DialogDescription>Review and manage flagged listing</DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Title</h3>
                <p>{selectedListing.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Price</h3>
                  <p>₹{selectedListing.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Category</h3>
                  <p>{selectedListing.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Seller</h3>
                  <p>{selectedListing.seller.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <Badge
                    variant={
                      selectedListing.status === "active"
                        ? "default"
                        : selectedListing.status === "flagged"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedListing.status.charAt(0).toUpperCase() + selectedListing.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p>{new Date(selectedListing.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/product/${selectedListing.id}`} target="_blank">
                    View Listing
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-0">
            {selectedListing?.status === "flagged" && (
              <>
                <Button variant="outline" onClick={() => handleListingAction("approve")}>
                  Approve Listing
                </Button>
                <Button variant="destructive" onClick={() => handleListingAction("remove")}>
                  Remove Listing
                </Button>
              </>
            )}

            {selectedListing?.status === "active" && (
              <Button variant="destructive" onClick={() => handleListingAction("remove")}>
                Remove Listing
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
