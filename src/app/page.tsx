"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Map, ShieldAlert, Car, Signal, ArrowRight, Activity, Zap } from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Active Traffic Map",
      description: "Real-time congestion tracking and route optimization.",
      icon: Map,
      href: "/traffic-map",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-200/20"
    },
    {
      title: "Smart Signal Control",
      description: "AI-driven signal synchronization for smoother flow.",
      icon: Signal,
      href: "/admin",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-200/20"
    },
    {
      title: "Report Violations",
      description: "Citizen reporting portal with instant evidence upload.",
      icon: ShieldAlert,
      href: "/report",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-200/20"
    },
    {
      title: "Smart Parking",
      description: "Find, book, and pay for parking spots instantly.",
      icon: Car,
      href: "/parking",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-200/20"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
        {/* Smart City Background - Enhanced UI */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background Image with Parallax-like effect */}
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{ backgroundImage: 'url(/smart-city.jpg)' }}
          ></div>

          {/* Gradient Overlay for better text readability and aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90"></div>

          {/* Subtle animated particles/glow */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <Zap className="mr-2 h-3.5 w-3.5 fill-current" />
                <span>Next-Gen Traffic Management System</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Building a Smarter <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Safer City</span>
            </motion.h1>

            <motion.p
              className="max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Empowering Solapur with AI-driven traffic solutions. Manage congestion, streamline parking, and enhance urban mobility with our unified platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Link href="/traffic-map" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                  <Activity className="mr-2 h-5 w-5" /> View Live Dashboard
                </Button>
              </Link>
              <Link href="/parking" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base border-primary/20 hover:bg-primary/5 transition-all hover:scale-105 backdrop-blur-sm">
                  Find Smart Parking
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-12 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Core Capabilities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to manage city traffic effectively, all in one place.</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Link href={feature.href} className="group block h-full">
                <Card className={`h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-card border ${feature.border} relative overflow-hidden group-hover:bg-accent/5`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color.replace('text-', 'from-').replace('-500', '-500 to-transparent')}`}></div>
                  <CardHeader>
                    <div className={`p-3 rounded-xl w-fit mb-4 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                      {feature.description}
                    </p>
                    <div className={`mt-4 flex items-center text-sm font-medium ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0`}>
                      Explore <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
