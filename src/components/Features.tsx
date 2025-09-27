import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  Shield,
  Brain,
  Headphones,
  BarChart3,
  Globe,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Mental Health Chat",
    description:
      "24/7 confidential AI companion trained on PHQ-9 & GAD-7 screening tools for psychological first-aid.",
    color: "bg-primary text-primary-foreground",
    details: [
      "Instant crisis support",
      "Mood tracking",
      "Personalized recommendations",
    ],
    href: "public/chatbot/index.html",
  },
  {
    icon: Calendar,
    title: "Secure Appointment Booking",
    description:
      "Book confidential sessions with qualified counselors. End-to-end encrypted and completely private.",
    color: "bg-secondary text-secondary-foreground",
    details: [
      "Licensed counselors",
      "Flexible scheduling",
      "Video/audio sessions",
    ],
    href: "/filter", // 👈 use href instead of link
  },
  {
    icon: BookOpen,
    title: "Multilingual Resource Hub",
    description:
      "Access mental health resources in English, Hindi, and regional languages. Videos, guides, and audio content.",
    color: "bg-accent text-accent-foreground",
    details: ["Cultural sensitivity", "Self-help guides", "Meditation content"],
    href: "/mental_resource",
  },
  {
    icon: Users,
    title: "Moderated Peer Support",
    description:
      "Connect with fellow students in a safe, moderated environment. Share experiences and support each other.",
    color: "bg-trust text-trust-foreground",
    details: ["Anonymous forums", "Expert moderation", "Group support circles"],
  },
  {
    icon: Shield,
    title: "Complete Privacy & Security",
    description:
      "Your data is encrypted and anonymous. We follow strict confidentiality protocols for student safety.",
    color: "bg-gradient-to-br from-purple-600 to-blue-600 text-white",
    details: ["End-to-end encryption", "Anonymous usage", "GDPR compliant"],
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your mental health journey with personalized insights and progress reports (completely private).",
    color: "bg-gradient-to-br from-green-600 to-teal-600 text-white",
    details: ["Mood analytics", "Progress reports", "Goal setting"],
    href: "/admin_panel",
  },
];

const stats = [
  { icon: Globe, value: "10+", label: "Languages Supported" },
  { icon: Clock, value: "24/7", label: "Available Support" },
  { icon: Brain, value: "100+", label: "Mental Health Resources" },
  { icon: Headphones, value: "50+", label: "Licensed Counselors" },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Everything You Need for{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our comprehensive platform addresses every aspect of student mental
            health - from immediate support to long-term wellness, all in one
            secure place.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const CardWrapper = ({ children }) =>
              feature.href ? (
                <a
                  key={index}
                  href={feature.href}
                  className="block no-underline"
                >
                  {children}
                </a>
              ) : (
                <div key={index}>{children}</div>
              );

            return (
              <CardWrapper>
                <Card className="group hover:shadow-medium transition-smooth border-border cursor-pointer">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CardWrapper>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-calm rounded-2xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Mental Health Journey?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are taking charge of their mental
            wellness. Start with a confidential chat or browse our resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8"
              onClick={() => (window.location.href = "/chatbot/index.html")}
            >
              Start Free Chat
            </Button>
            <Button variant="calm" size="lg" className="text-lg px-8">
              Explore Resources
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
