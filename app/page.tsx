import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Book, Calculator, ChevronRight, Pencil, Ruler, Shirt, PenToolIcon as Tool } from "lucide-react"
import { FeaturedListings } from "@/components/featured-listings"

export default function Home() {
  const categories = [
    { name: "Books", icon: Book, href: "/browse?category=books" },
    { name: "Tools", icon: Tool, href: "/browse?category=tools" },
    { name: "Drafters", icon: Ruler, href: "/browse?category=drafters" },
    { name: "Calculators", icon: Calculator, href: "/browse?category=calculators" },
    { name: "Aprons", icon: Shirt, href: "/browse?category=aprons" },
    { name: "Notes", icon: Pencil, href: "/browse?category=notes" },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary/10 py-20 md:py-32">
        <div className="container flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Sustainable Sharing.
            <br />
            <span className="text-primary/80">Student-to-Student Deals.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Buy and sell secondhand college equipment with LOOP - the trusted marketplace for students.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/browse">Browse Listings</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Join LOOP</Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-primary">Browse Categories</h2>
          <p className="mt-2 text-lg text-muted-foreground">Find exactly what you need for your courses</p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <category.icon className="h-10 w-10 text-primary" />
                    <h3 className="mt-4 font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">Featured Listings</h2>
              <p className="mt-2 text-lg text-muted-foreground">Check out these popular items from fellow students</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex">
              <Link href="/browse" className="gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            <FeaturedListings />
          </div>

          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild>
              <Link href="/browse">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold tracking-tight text-primary">How LOOP Works</h2>
          <p className="mt-2 text-center text-lg text-muted-foreground">Simple, secure, and sustainable</p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mt-4 text-xl font-medium">List or Browse</h3>
              <p className="mt-2 text-muted-foreground">List your unused equipment or browse what others are selling</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mt-4 text-xl font-medium">Connect</h3>
              <p className="mt-2 text-muted-foreground">Chat with sellers, ask questions, and make offers</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mt-4 text-xl font-medium">Exchange</h3>
              <p className="mt-2 text-muted-foreground">Meet on campus for a safe exchange of items and payment</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
