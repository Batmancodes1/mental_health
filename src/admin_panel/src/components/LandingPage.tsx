import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import "../index.css";
import {
  Brain,
  Heart,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useRef } from "react";
import heroImage from "../assets/hero-wellness.jpg";

interface LandingPageProps {
  onStartAssessment: () => void;
}

export default function LandingPage({ onStartAssessment }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const features = [
    {
      icon: Brain,
      title: "Professional Assessment",
      description:
        "Standardized PHQ-9, GAD-7, and GHQ-12 screening tools used by healthcare professionals worldwide",
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description:
        "Get tailored recommendations and self-care strategies based on your individual results",
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description:
        "Your responses are confidential and secure. Results are for your awareness and growth",
    },
    {
      icon: Users,
      title: "Professional Support",
      description:
        "Access to counselor directory and mental health resources when you need them most",
    },
  ];

  const benefits = [
    "Immediate results with professional interpretation",
    "Downloadable PDF report for healthcare providers",
    "Personalized self-care recommendations",
    "Anonymous data helps improve campus mental health",
  ];

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-80" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Mental Health
              <br />
              <span className="bg-gradient-to-r from-primary-glow to-secondary bg-clip-text text-transparent">
                Matters
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Take a confidential, professional assessment to understand your
              mental well-being and discover personalized resources for your
              journey to wellness.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={onStartAssessment}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 shadow-glow animate-glow-pulse"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className="w-6 h-10 border-2 border-white rounded-full mx-auto mb-2">
              <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-pulse" />
            </div>
            <p className="text-sm">Scroll to explore</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Professional Mental Health Screening
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform uses validated psychological assessment tools to
              provide you with accurate insights into your mental well-being.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center hover:shadow-medium transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-wellness rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What You'll Receive
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our comprehensive assessment provides you with professional
                insights and actionable next steps for your mental health
                journey.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8 shadow-medium">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-wellness rounded-full flex items-center justify-center animate-float">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Begin?</h3>
                  <p className="text-muted-foreground mb-6">
                    Take the first step towards understanding and improving your
                    mental well-being.
                  </p>
                  <Button
                    size="lg"
                    onClick={onStartAssessment}
                    className="w-full bg-gradient-wellness text-white hover:opacity-90"
                  >
                    Start Assessment Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Journey to Better Mental Health Starts Here
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have taken control of their mental
              well-being through our professional assessment platform.
            </p>
            <Button
              size="lg"
              onClick={onStartAssessment}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
            >
              Begin Your Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
