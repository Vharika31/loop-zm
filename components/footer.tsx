import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">LOOP</span>
            </Link>
            <p className="text-sm text-muted-foreground">Sustainable sharing. Student-to-Student deals.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Marketplace</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/browse" className="text-sm text-muted-foreground hover:text-primary">
                    Browse All
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/featured" className="text-sm text-muted-foreground hover:text-primary">
                    Featured Items
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Account</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/buyer" className="text-sm text-muted-foreground hover:text-primary">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Info</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                    About LOOP
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LOOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
