import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListServices, useListReviews } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";

import heroImg from "@/assets/images/hero.png";
import facialImg from "@/assets/images/service-facial.png";
import haircutImg from "@/assets/images/service-haircut.png";
import makeupImg from "@/assets/images/service-makeup.png";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Home() {
  const { data: services } = useListServices();
  const { data: reviews } = useListReviews({ approved: "true" });

  const featuredServices = services?.slice(0, 3) || [];
  const topReviews = reviews?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Luxury Salon Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={STAGGER}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.span variants={FADE_UP} className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wider uppercase mb-4 border border-primary/20">
              Premium Beauty Destination
            </motion.span>
            
            <motion.h1 variants={FADE_UP} className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
              Style that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">defines you.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Experience intimate luxury in Lahore. We believe every visit should be a transformation, leaving you feeling confident, beautiful, and empowered.
            </motion.p>
            
            <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/booking">
                <Button size="lg" className="rounded-full px-8 py-6 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 w-full sm:w-auto">
                  Book Appointment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base bg-background/50 backdrop-blur hover:bg-background border-border w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={STAGGER}
            className="text-center mb-16"
          >
            <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Signature Services</motion.h2>
            <motion.p variants={FADE_UP} className="text-muted-foreground max-w-2xl mx-auto">Curated treatments designed to enhance your natural beauty using only premium products.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group cursor-pointer rounded-3xl overflow-hidden relative"
            >
              <div className="aspect-[4/5] relative">
                <img src={haircutImg} alt="Hair Styling" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">Hair Styling</h3>
                  <p className="text-white/80 text-sm mb-4">Precision cuts, color transformations, and luxury blowouts.</p>
                  <span className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
                    View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer rounded-3xl overflow-hidden relative"
            >
              <div className="aspect-[4/5] relative">
                <img src={facialImg} alt="Skin Care" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">Skin Care</h3>
                  <p className="text-white/80 text-sm mb-4">Rejuvenating facials and advanced skincare treatments.</p>
                  <span className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
                    View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group cursor-pointer rounded-3xl overflow-hidden relative"
            >
              <div className="aspect-[4/5] relative">
                <img src={makeupImg} alt="Bridal & Glamour" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">Bridal & Glamour</h3>
                  <p className="text-white/80 text-sm mb-4">Flawless makeup application for your most special moments.</p>
                  <span className="inline-flex items-center text-sm font-medium hover:text-primary transition-colors">
                    View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline" className="rounded-full px-8">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">A Sanctuary for<br/>Your Beauty Journey</h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Nestled in the heart of DHA Lahore, Looks N Styles offers a retreat from the bustling city. Our expertly trained staff use only the finest international brands to ensure you receive world-class treatment in an atmosphere of refined elegance.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">Premium Products</h4>
                    <p className="text-muted-foreground text-sm">We exclusively use high-end international brands for all treatments.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">Easy Booking</h4>
                    <p className="text-muted-foreground text-sm">Seamless online scheduling to value your precious time.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold mb-1">Dedicated Attention</h4>
                    <p className="text-muted-foreground text-sm">Personalized consultations before every service.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50" />
              <img src={facialImg} alt="Salon Experience" className="relative z-10 rounded-3xl shadow-2xl border border-border/50 object-cover aspect-[3/4] w-full max-w-md mx-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Client Stories</h2>
            <p className="text-muted-foreground">What our beautiful clients have to say.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topReviews?.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full bg-background/50 border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex text-primary mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-primary" : "fill-muted text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-foreground/90 italic mb-6 text-lg">"{review.comment}"</p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-serif font-bold text-lg mr-4">
                        {review.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{review.customerName}</h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/reviews">
              <Button variant="ghost" className="hover:bg-primary/5 text-primary">Read More Reviews <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground"
          >
            Ready for your transformation?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-10"
          >
            Book your appointment today and step into a world of elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/booking">
              <Button size="lg" className="rounded-full px-10 py-7 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                Schedule Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
