import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Plus, Share, Download, ThumbsUp, ThumbsDown, Heart } from "lucide-react"

interface VideoDetailsProps {
  videoData: {
    title: string
    description: string
    duration: string
    year: string
    rating: number
    genres: string[]
    director: string
    cast: string[]
  }
}

export function VideoDetails({ videoData }: VideoDetailsProps) {
  const reviews = [
    {
      id: 1,
      user: "MovieBuff2023",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "Absolutely incredible! Heath Ledger's performance as the Joker is legendary. This movie redefined what superhero films could be.",
      date: "2 days ago",
      likes: 24,
    },
    {
      id: 2,
      user: "CinemaLover",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "Christopher Nolan's masterpiece. The cinematography, story, and performances are all top-notch. A must-watch!",
      date: "1 week ago",
      likes: 18,
    },
    {
      id: 3,
      user: "ActionFan",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment: "Great action sequences and compelling story. Christian Bale brings depth to Batman like never before.",
      date: "2 weeks ago",
      likes: 12,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Title and Basic Info */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-foreground">{videoData.title}</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Watchlist
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-lg font-semibold text-foreground">{videoData.rating}</span>
            <span className="text-muted-foreground ml-1">/10</span>
          </div>
          <span className="text-muted-foreground">{videoData.year}</span>
          <span className="text-muted-foreground">{videoData.duration}</span>
          <Badge variant="secondary">HD</Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {videoData.genres.map((genre) => (
            <Badge key={genre} variant="outline">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed mb-6">{videoData.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Director</h3>
            <p className="text-muted-foreground">{videoData.director}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Cast</h3>
            <p className="text-muted-foreground">{videoData.cast.join(", ")}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <ThumbsUp className="h-4 w-4" />
          <span>Like</span>
          <span className="text-muted-foreground">(1.2k)</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <ThumbsDown className="h-4 w-4" />
          <span>Dislike</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Heart className="h-4 w-4" />
          <span>Favorite</span>
        </Button>
      </div>

      <Separator />

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>
          <Button variant="outline">Write a Review</Button>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                    <AvatarFallback>{review.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground">{review.user}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">{review.comment}</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {review.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
