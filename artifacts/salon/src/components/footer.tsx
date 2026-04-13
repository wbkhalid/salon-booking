import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary block mb-4">
              Looks N Styles
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              A premium beauty salon in Lahore, where every visit is a transformation. Experience intimate luxury and exceptional care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">DHA Phase 6<br />Lahore, Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">+92 321 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">hello@looksnstyles.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 tracking-wide">Opening Hours</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Monday - Friday</span> <span>10:00 AM - 8:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 9:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span>11:00 AM - 6:00 PM</span></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Looks N Styles. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
