"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Play, Clapperboard, Laugh, Users, Popcorn, Heart } from "lucide-react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, get } from "firebase/database"
import { app } from "@/lib/firebase"

export default function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const auth = getAuth(app)
  const db = getDatabase(app)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const roleRef = ref(db, `roles/${user.uid}`)
        const snapshot = await get(roleRef)
        if (snapshot.exists() && snapshot.val() === "admin") {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      setLoading(false) // ✅ only update after Firebase check
    })

    return () => unsubscribe()
  }, [auth, db])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/1stpagebackground.png')` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Moji<span className="text-primary">Flix</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Unlimited movies, and FilmyMoji fun. Watch, laugh & react together!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold">
                <Play className="mr-2 h-5 w-5" />
                Start Watching
              </Button>
            </Link>

            <Link href="/adminlogin">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent">
                Admin Sign In
              </Button>
            </Link>

            {/* 🔐 Only render after Firebase check is done */}
            {!loading && isAdmin && (
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => router.push("/adminpanel")}
              >
                🔒 Admin Panel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Funny Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">
            Why Choose MojiFlix?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Feature icon={<Clapperboard className="h-8 w-8 text-primary" />} bg="bg-primary/10" title="Full-On Filmy" text="From Bollywood drama to South masala — all the tadka you need in one app." />
            <Feature icon={<Laugh className="h-8 w-8 text-accent" />} bg="bg-accent/10" title="Moji Reactions" text="Cry 😢, laugh 😂, or do a full filmy slow clap 👏 — react with custom FilmyMojis!" />
            <Feature icon={<Users className="h-8 w-8 text-secondary" />} bg="bg-secondary/10" title="Squad Goals" text="Host watch parties, roast villains, and whistle for heroes with your gang. 🍿" />
            <Feature icon={<Popcorn className="h-8 w-8 text-primary" />} bg="bg-primary/10" title="Popcorn Mode" text="Skip ads, not snacks — binge your favorites without interruption." />
            <Feature icon={<Heart className="h-8 w-8 text-accent" />} bg="bg-accent/10" title="Filmy Romance" text="Perfect date night? Stream love stories & rom-coms with extra cheesy lines. ❤️" />
            <Feature icon={<Play className="h-8 w-8 text-secondary" />} bg="bg-secondary/10" title="One More Episode" text='Warning: MojiFlix may cause "just one more episode" syndrome. Watch responsibly 😅' />
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, bg, title, text }: { icon: React.ReactNode; bg: string; title: string; text: string }) {
  return (
    <div className="text-center p-6">
      <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{text}</p>
    </div>
  )
}
