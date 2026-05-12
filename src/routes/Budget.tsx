"use client"

import { createFileRoute } from "@tanstack/react-router"
import { Wallet } from "lucide-react"

export const Route = createFileRoute("/Budget")({
  component: Budget,
})

function Budget() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Wallet className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Feature Coming Soon</h1>
      <p className="text-muted-foreground max-w-sm">
        Budget management is on its way. You'll be able to set spending limits and track your progress by category.
      </p>
    </div>
  )
}
