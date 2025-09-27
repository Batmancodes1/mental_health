import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, BookOpen, Users } from "lucide-react";
import heroImage from "@/assets/hero-mental-health.jpg";

export function Hero() {
  return (
    <section className="bg-gradient-calm py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Mental Health{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Matters
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
              A confidential, stigma-free digital platform designed specifically for students in higher education. 
              Get support, connect with peers, and access resources - all in a safe, culturally sensitive environment.
            </p>

            {/* Feature Pills */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-primary-muted px-4 py-2 rounded-full">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI Support Chat</span>
              </div>
              <div className="flex items-center space-x-2 bg-secondary-muted px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Book Counseling</span>
              </div>
              <div className="flex items-center space-x-2 bg-accent-muted px-4 py-2 rounded-full">
                <BookOpen className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Resource Hub</span>
              </div>
              <div className="flex items-center space-x-2 bg-trust/10 px-4 py-2 rounded-full">
                <Users className="h-4 w-4 text-trust" />
                <span className="text-sm font-medium text-trust">Peer Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Start Your Journey
              </Button>
              <Button variant="calm" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Available Support</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">100%</p>
                <p className="text-sm text-muted-foreground">Confidential</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">Free</p>
                <p className="text-sm text-muted-foreground">For All Students</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-strong">
              <img
                src={heroImage}
                alt="Students supporting each other in a peaceful campus setting"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card shadow-medium rounded-xl p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-trust rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">AI Chat Active</p>
                  <p className="text-xs text-muted-foreground">Ready to help</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-card shadow-medium rounded-xl p-4 border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Peer Support</p>
                  <p className="text-xs text-muted-foreground">Join community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}