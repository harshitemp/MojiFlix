"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      // For demo purposes, redirect to dashboard
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-card-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-input border-border text-card-foreground"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-card-foreground">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 bg-input border-border text-card-foreground"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-card-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  )
}
