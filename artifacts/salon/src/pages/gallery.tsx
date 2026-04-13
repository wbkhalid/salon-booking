import { useState } from "react";
import { Layout } from "@/components/layout";
import { useListGallery } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import img1 from "@/assets/images/gallery-1.png";
import img2 from "@/assets/images/gallery-2.png";
import img3 from "@/assets/images/gallery-3.png";
import heroImg from "@/assets/images/hero.png";
import facialImg from "@/assets/images/service-facial.png";
import haircutImg from "@/assets/images/service-haircut.png";

// Provide some fallback images if the API doesn't return enough
const fallbackImages = [
  { id: 901, imageUrl: img1, caption: "Beautiful glow", category: "Makeup", sortOrder: 1, createdAt: "" },
  { id: 902, imageUrl: haircutImg, caption: "Precision cut", category: "Hair", sortOrder: 2, createdAt: "" },
  { id: 903, imageUrl: img2, caption: "Bridal elegance", category: "Makeup", sortOrder: 3, createdAt: "" },
  { id: 904, imageUrl: facialImg, caption: "Relaxing facial", category: "Skin", sortOrder: 4, createdAt: "" },
  { id: 905, imageUrl: img3, caption: "Color transformation", category: "Hair", sortOrder: 5, createdAt: "" },
  { id: 906, imageUrl: heroImg, caption: "Our luxury interior", category: "Salon", sortOrder: 6, createdAt: "" },
];

export default function Gallery() {
  const { data: apiGallery, isLoading } = useListGallery();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Use API images if available, otherwise fallbacks
  const gallery = apiGallery?.length ? apiGallery : fallbackImages;

  const categories = Array.from(new Set(gallery.map(img => img.category).filter(Boolean))) as string[];

  const filteredGallery = gallery.filter(img => 
    activeCategory ? img.category === activeCategory : true
  );

  return (
    <Layout>
      <div className="bg-background min-h-screen py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">Our Gallery</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse into the transformations and the luxurious atmosphere at Looks N Styles.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              onClick={() => setActiveCategory(null)}
              className="rounded-full"
            >
              All
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

          {isLoading && !apiGallery?.length ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-muted animate-pulse rounded-2xl h-64 w-full break-inside-avoid" style={{ height: `${Math.max(250, Math.random() * 500)}px` }} />
              ))}
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredGallery.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => setLightboxImage(img.imageUrl)}
                >
                  <img 
                    src={img.imageUrl} 
                    alt={img.caption || "Gallery Image"} 
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-white font-serif text-lg font-medium">{img.caption}</p>
                    <p className="text-white/70 text-sm">{img.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-6 right-6 text-white hover:bg-white/20 hover:text-white z-50 rounded-full"
              onClick={() => setLightboxImage(null)}
            >
              <X className="h-8 w-8" />
            </Button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxImage}
              alt="Enlarged"
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
