import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListReviews, useCreateReview, getListReviewsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

export default function Reviews() {
  const { data: reviews, isLoading } = useListReviews({ approved: "true" });
  const createReview = useCreateReview();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    customerName: "",
    rating: 5,
    comment: ""
  });
  
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.comment) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    createReview.mutate({
      data: formData
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
        setFormData({ customerName: "", rating: 5, comment: "" });
        toast({ title: "Review submitted successfully!" });
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey({ approved: "true" }) });
      },
      onError: () => {
        toast({ title: "Failed to submit review", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">Client Experiences</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Read what our clients have to say about their transformations at Looks N Styles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-card border border-border rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {reviews?.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="h-full bg-card hover:border-primary/30 transition-colors shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex text-primary mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} 
                              />
                            ))}
                          </div>
                          <p className="text-foreground/90 italic mb-6 leading-relaxed">"{review.comment}"</p>
                          <div className="flex items-center mt-auto">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mr-3">
                              {review.customerName.charAt(0)}
                            </div>
                            <span className="font-semibold text-sm">{review.customerName}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-1 sticky top-24">
              <Card className="bg-card shadow-lg border-border/50">
                <CardContent className="p-6 md:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                        <Star className="h-8 w-8 fill-primary" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-foreground">Thank You!</h3>
                      <p className="text-muted-foreground">Your review has been submitted and is pending approval.</p>
                      <Button variant="outline" className="mt-4 rounded-full" onClick={() => setIsSubmitted(false)}>
                        Write another review
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-serif font-bold">Share Your Experience</h3>
                        <p className="text-sm text-muted-foreground mt-2">We value your feedback</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex justify-center space-x-1 bg-background py-3 rounded-lg border border-border">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFormData({ ...formData, rating: star })}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                className={`h-8 w-8 ${(hoveredStar || formData.rating) >= star ? "fill-primary text-primary" : "text-muted-foreground fill-transparent"} transition-colors`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input 
                          id="name" 
                          required
                          value={formData.customerName}
                          onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                          className="bg-background rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comment">Your Review</Label>
                        <Textarea 
                          id="comment" 
                          required
                          value={formData.comment}
                          onChange={(e) => setFormData({...formData, comment: e.target.value})}
                          className="min-h-[120px] bg-background rounded-lg"
                          placeholder="Tell us about your transformation..."
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={createReview.isPending}
                        className="w-full rounded-full shadow-lg shadow-primary/20"
                      >
                        {createReview.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
