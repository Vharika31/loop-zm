"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Book,
  Calculator,
  Filter,
  Pencil,
  Ruler,
  Search,
  Shirt,
  SlidersHorizontal,
  PenToolIcon as Tool,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

type Product = {
  id: string
  title: string
  price: number
  condition: string
  category: string
  department: string
  image: string
}

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])

  const conditions = ["New", "Like New", "Excellent", "Good", "Fair"]
  const departments = ["Computer Science", "Mechanical", "Electrical", "Civil", "Chemical"]

  const categories = [
    { name: "All", icon: Filter, value: null },
    { name: "Books", icon: Book, value: "books" },
    { name: "Tools", icon: Tool, value: "tools" },
    { name: "Drafters", icon: Ruler, value: "drafters" },
    { name: "Calculators", icon: Calculator, value: "calculators" },
    { name: "Aprons", icon: Shirt, value: "aprons" },
    { name: "Notes", icon: Pencil, value: "notes" },
  ]

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => {
      const categoryIndex = Math.floor(Math.random() * (categories.length - 1)) + 1
      const conditionIndex = Math.floor(Math.random() * conditions.length)
      const departmentIndex = Math.floor(Math.random() * departments.length)
      const price = Math.floor(Math.random() * 90) + 10

      return {
        id: `product-${i + 1}`,
        title: `${categories[categoryIndex].name} Item ${i + 1}`,
        price,
        condition: conditions[conditionIndex],
        category: categories[categoryIndex].value!,
        department: departments[departmentIndex],
        image: "/placeholder.svg?height=200&width=300",
      }
    })

    setProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter((product) => product.department === selectedDepartment)
    }

    // Apply price range filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply condition filter
    if (selectedConditions.length > 0) {
      filtered = filtered.filter((product) => selectedConditions.includes(product.condition))
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedDepartment, priceRange, selectedConditions])

  const handleConditionChange = (condition: string) => {
    setSelectedConditions((prev) => {
      if (prev.includes(condition)) {
        return prev.filter((c) => c !== condition)
      } else {
        return [...prev, condition]
      }
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-primary">Browse Listings</h1>
          <p className="text-muted-foreground">Find the perfect equipment for your courses</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64 md:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search listings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down your search results</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Mobile filters */}
                <div className="space-y-4">
                  <h3 className="font-medium">Category</h3>
                  <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value || ""}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Department</h3>
                  <Select
                    value={selectedDepartment || ""}
                    onValueChange={(value) => setSelectedDepartment(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Price Range</h3>
                    <span className="text-sm text-muted-foreground">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                  </div>
                  <Slider defaultValue={[0, 100]} max={100} step={5} value={priceRange} onValueChange={setPriceRange} />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Condition</h3>
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`condition-${condition}`}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() => handleConditionChange(condition)}
                        />
                        <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedDepartment(null)
                    setPriceRange([0, 100])
                    setSelectedConditions([])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mt-6 overflow-auto pb-2">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className="flex items-center gap-1.5"
              onClick={() => setSelectedCategory(category.value)}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Desktop filters */}
        <div className="hidden space-y-6 md:block">
          <div className="space-y-4">
            <h3 className="font-medium">Department</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-departments"
                  checked={selectedDepartment === null}
                  onCheckedChange={() => setSelectedDepartment(null)}
                />
                <Label htmlFor="all-departments">All Departments</Label>
              </div>
              {departments.map((department) => (
                <div key={department} className="flex items-center space-x-2">
                  <Checkbox
                    id={`department-${department}`}
                    checked={selectedDepartment === department}
                    onCheckedChange={() => setSelectedDepartment(department)}
                  />
                  <Label htmlFor={`department-${department}`}>{department}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Price Range</h3>
              <span className="text-sm text-muted-foreground">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </span>
            </div>
            <Slider defaultValue={[0, 100]} max={100} step={5} value={priceRange} onValueChange={setPriceRange} />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condition-desktop-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => handleConditionChange(condition)}
                  />
                  <Label htmlFor={`condition-desktop-${condition}`}>{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedCategory(null)
              setSelectedDepartment(null)
              setPriceRange([0, 100])
              setSelectedConditions([])
            }}
          >
            Reset Filters
          </Button>
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No listings found</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                  setSelectedDepartment(null)
                  setPriceRange([0, 100])
                  setSelectedConditions([])
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="mb-2">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{product.condition}</span>
                        </div>
                        <h3 className="font-medium line-clamp-1">{product.title}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-primary">₹{product.price}</span>
                          <span className="text-xs text-muted-foreground">{product.department}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
