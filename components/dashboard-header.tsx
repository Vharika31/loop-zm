import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
