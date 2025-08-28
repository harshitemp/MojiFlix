"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react" // 👈 icon library (shipped with shadcn/ui)

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false) // 👈 toggle state

  // Hardcoded admin credentials (⚠️ should move to secure storage later)
  const ADMIN_USER = "mojiflix"
  const ADMIN_PASS = "Moj!@#Fl!x$8"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("isAdmin", "true")
      router.push("/admin") // redirect to admin dashboard
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-foreground">
              Moji<span className="text-primary">Flix</span>
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">Admin Panel Login</p>
        </div>

        <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">Admin Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // 👈 toggle type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">For admin use only 🚀</p>
          </div>
        </div>
      </div>
    </div>
  )
}
