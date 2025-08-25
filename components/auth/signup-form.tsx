"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false)
      // For demo purposes, redirect to dashboard
      router.push("/dashboard")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-card-foreground">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="pl-10 bg-input border-border text-card-foreground"
            required
          />
        </div>
      </div>

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
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
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
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-card-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className="pl-10 pr-10 bg-input border-border text-card-foreground"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-card-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
        />
        <Label htmlFor="terms" className="text-sm text-card-foreground">
          I agree to the{" "}
          <a href="#" className="text-primary hover:text-primary/80">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:text-primary/80">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  )
}
