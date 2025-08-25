import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Star } from "lucide-react"
import Link from "next/link"

interface RelatedContentProps {
  currentVideoId: string
}

export function RelatedContent({ currentVideoId }: RelatedContentProps) {
  const relatedVideos = [
    {
      id: "batman-begins",
      title: "Batman Begins",
      year: "2005",
      duration: "2h 20m",
      rating: 8.2,
      thumbnail: "/generic-movie-poster.png",
      genre: "Action",
    },
    {
      id: "dark-knight-rises",
      title: "The Dark Knight Rises",
      year: "2012",
      duration: "2h 45m",
      rating: 8.4,
      thumbnail: "/generic-movie-poster.png",
      genre: "Action",
    },
    {
      id: "joker",
      title: "Joker",
      year: "2019",
      duration: "2h 2m",
      rating: 8.4,
      thumbnail: "/generic-movie-poster.png",
      genre: "Drama",
    },
    {
      id: "batman-v-superman",
      title: "Batman v Superman",
      year: "2016",
      duration: "2h 31m",
      rating: 6.4,
      thumbnail: "/generic-movie-poster.png",
      genre: "Action",
    },
    {
      id: "suicide-squad",
      title: "Suicide Squad",
      year: "2016",
      duration: "2h 3m",
      rating: 5.9,
      thumbnail: "/generic-movie-poster.png",
      genre: "Action",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">More Like This</h2>

      <div className="space-y-4">
        {relatedVideos.map((video) => (
          <Link key={video.id} href={`/watch/${video.id}`}>
            <Card className="group cursor-pointer hover:bg-card/80 transition-colors">
              <CardContent className="p-0">
                <div className="flex space-x-3 p-3">
                  <div className="relative w-24 h-36 flex-shrink-0">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-card-foreground text-sm truncate pr-2">{video.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {video.rating}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {video.genre}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{video.year}</span>
                    </div>

                    <p className="text-xs text-muted-foreground">{video.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
