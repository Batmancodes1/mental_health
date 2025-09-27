import { Heart, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">MindCare</h3>
                <p className="text-xs text-background/70">Student Mental Health</p>
              </div>
            </div>
            <p className="text-sm text-background/80 leading-relaxed">
              Empowering students with accessible, confidential mental health support 
              designed for the unique challenges of higher education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-background/80 hover:text-background transition-smooth">Features</a></li>
              <li><a href="#resources" className="text-background/80 hover:text-background transition-smooth">Resources</a></li>
              <li><a href="#support" className="text-background/80 hover:text-background transition-smooth">Support</a></li>
              <li><a href="#about" className="text-background/80 hover:text-background transition-smooth">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/80 hover:text-background transition-smooth">Crisis Help</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-smooth">FAQs</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-smooth">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Emergency Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-background/60" />
                <span className="text-background/80">Crisis Helpline: 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-background/60" />
                <span className="text-background/80">support@mindcare.edu</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-background/60 mt-0.5" />
                <span className="text-background/80">Available across India<br/>Regional language support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-background/60">
            © 2024 MindCare. Built for Smart India Hackathon. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <p className="text-xs text-background/50">
              🇮🇳 Supporting students across India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}