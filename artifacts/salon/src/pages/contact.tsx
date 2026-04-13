import { useState } from "react";
import { Layout } from "@/components/layout";
import { useCreateContactMessage } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const createMessage = useCreateContactMessage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    createMessage.mutate({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message
      }
    }, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({ title: "Message sent successfully!" });
      },
      onError: () => {
        toast({ title: "Failed to send message", variant: "destructive" });
      }
    });
  };

  return (
    <Layout>
      <div className="bg-background min-h-screen py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Reach out with any questions or visit our beautiful salon in Lahore.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              <div>
                <h3 className="text-2xl font-serif font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Our Location</h4>
                      <p className="text-muted-foreground text-sm">DHA Phase 6<br/>Lahore, Pakistan</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Phone</h4>
                      <p className="text-muted-foreground text-sm">+92 321 1234567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground text-sm">hello@looksnstyles.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mr-4">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Opening Hours</h4>
                      <p className="text-muted-foreground text-sm">Mon - Fri: 10:00 AM - 8:00 PM<br/>Sat: 10:00 AM - 9:00 PM<br/>Sun: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13612.825227709355!2d74.4578121!3d31.4635105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391908cefa2d5d85%3A0xcb1db229ef5e0e0!2sDHA%20Phase%206%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale contrast-75 dark:invert dark:hue-rotate-180 transition-all duration-500"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-card shadow-xl border-border/50 h-full">
                <CardContent className="p-8 md:p-10">
                  {isSubmitted ? (
                    <div className="text-center py-20 space-y-4">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="h-10 w-10" />
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-foreground">Message Sent</h3>
                      <p className="text-muted-foreground text-lg mb-8">We have received your message and will get back to you shortly.</p>
                      <Button className="rounded-full px-8" onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", message: "" });
                      }}>
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <h3 className="text-2xl font-serif font-bold mb-6">Send us a Message</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-background rounded-lg"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-background rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="bg-background rounded-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea 
                          id="message" 
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="min-h-[150px] bg-background rounded-lg"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={createMessage.isPending}
                        className="w-full rounded-full py-6 text-lg shadow-lg shadow-primary/20"
                      >
                        {createMessage.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
