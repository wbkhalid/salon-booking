import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Services() {
  const { data: services, isLoading } = useListServices();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = services 
    ? Array.from(new Set(services.map(s => s.category))) 
    : [];

  const filteredServices = services?.filter(s => 
    activeCategory ? s.category === activeCategory : true
  );

  return (
    <Layout>
      <div className="bg-background min-h-screen py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">Our Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive range of luxury treatments, designed to enhance your natural beauty and provide the ultimate pampering experience.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              onClick={() => setActiveCategory(null)}
              className="rounded-full"
            >
              All Services
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices?.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial="hidden"
                  animate="visible"
                  variants={FADE_UP}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover:border-primary/50 transition-colors bg-card overflow-hidden">
                    {service.imageUrl && (
                      <div className="h-48 w-full overflow-hidden">
                        <img 
                          src={service.imageUrl} 
                          alt={service.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                      </div>
                    )}
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-serif font-bold text-foreground">{service.name}</h3>
                        <span className="font-semibold text-primary">Rs {service.price.toLocaleString()}</span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm flex-1 mb-6">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.durationMinutes} mins
                          </span>
                          <span className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {service.category}
                          </span>
                        </div>
                        
                        <Link href={`/booking?serviceId=${service.id}`}>
                          <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                            Book
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredServices?.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No services found in this category.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
