import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Clapperboard, Laugh, Users, Popcorn, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/1stpagebackground.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Moji<span className="text-primary">Flix</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Unlimited movies,  and FilmyMoji fun. Watch, laugh & react together!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Watching
              </Button>
            </Link>
            <Link href="/adminlogin">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                Admin Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Funny Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Why Choose MojiFlix?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clapperboard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Full-On Filmy</h3>
              <p className="text-muted-foreground">
                From Bollywood drama to South masala — all the tadka you need in one app.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Laugh className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Moji Reactions</h3>
              <p className="text-muted-foreground">
                Cry 😢, laugh 😂, or do a full filmy slow clap 👏 — react with custom FilmyMojis!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Squad Goals</h3>
              <p className="text-muted-foreground">
                Host watch parties, roast villains, and whistle for heroes with your gang. 🍿
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Popcorn className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Popcorn Mode</h3>
              <p className="text-muted-foreground">
                Skip ads, not snacks — binge your favorites without interruption.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Filmy Romance</h3>
              <p className="text-muted-foreground">
                Perfect date night? Stream love stories & rom-coms with extra cheesy lines. ❤️
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">One More Episode</h3>
              <p className="text-muted-foreground">
                Warning: MojiFlix may cause "just one more episode" syndrome. Watch responsibly 😅
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
