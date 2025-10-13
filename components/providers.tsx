"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { LibraryProvider } from "@/contexts/library-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LibraryProvider>{children}</LibraryProvider>
    </SessionProvider>
  )
}
