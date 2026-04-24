"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  FiUsers,
  FiTarget,
  FiHeart,
  FiZap,
  FiShield,
  FiGlobe,
  FiTrendingUp,
  FiArrowRight,
  FiMail,
  FiBarChart2
} from "react-icons/fi";

export default function AboutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const stats = [
    { number: "50K+", label: "Active Users", icon: <FiUsers className="w-6 h-6" />, gradient: "from-blue-500 to-cyan-500" },
    { number: "1M+", label: "Snippets Saved", icon: <FiZap className="w-6 h-6" />, gradient: "from-purple-500 to-pink-500" },
    { number: "99.9%", label: "Uptime", icon: <FiShield className="w-6 h-6" />, gradient: "from-green-500 to-emerald-500" },
    { number: "150+", label: "Countries", icon: <FiGlobe className="w-6 h-6" />, gradient: "from-orange-500 to-red-500" }
  ];

  const values = [
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: "User-First Design",
      description: "Every feature is built with developers' needs in mind, ensuring intuitive and efficient workflows.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Security & Privacy",
      description: "Enterprise-grade security with complete user control over their data and privacy.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly evolving with AI-powered features and cutting-edge technology.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Community",
      description: "Building a global community of creators who share knowledge and best practices.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "Founded",
      description: "SnippifyX was born from the frustration of scattered content",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      year: "2025",
      title: "First 10K Users",
      description: "Reached our first major milestone with 10,000 active creators",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 gradient-text animate-fade-in">
            About SnippifyX
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            We're on a mission to revolutionize how creators organize and reuse their content.
            SnippifyX was born from the frustration of scattered snippets and lost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="text-xl px-10 py-6 btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 group"
              onClick={() => router.push('/signup')}
            >
              <FiTrendingUp className="mr-3 h-6 w-6" />
              Get Started
              <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="group relative text-center hover:scale-110 transition-transform duration-300 p-6 rounded-2xl hover:bg-white/50">
                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold gradient-text mb-3">{stat.number}</div>
                  <div className="text-muted-foreground text-lg">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Story Section */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">Our Story</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">From a simple idea to a global platform</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-6 gradient-text">The Problem</h3>
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    In 2024, Yasir Jabbar was working as a developer at a tech company.
                    He found himself constantly rewriting the same snippets, losing hours to searching
                    through scattered files and outdated documentation.
                  </p>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    "I was spending more time looking for code I'd already written than actually writing new content. There had to be a better way."
                  </p>
                  <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                    <p className="text-blue-800 font-bold text-lg">
                      "Our mission is simple: help developers write less and build more."
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-bold mb-6 gradient-text">The Solution</h3>
                  <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                    SnippifyX was born from this frustration. A platform that stores, organizes,
                    and helps you reuse your code snippets intelligently.
                  </p>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    Today, SnippifyX helps thousands of creators save time and stay organized —
                    from individual developers to enterprise teams.
                  </p>
                </div>
                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={index} className="group relative flex items-start gap-6 hover:scale-105 transition-transform duration-300 p-4 rounded-2xl hover:bg-white/50">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                        {item.year}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 gradient-text">{item.title}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection className="py-24 bg-white relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">Our Values</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">The principles that guide everything we do</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">{value.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Developer Section — Sirf Yasir Jabbar */}
      <AnimatedSection className="py-24 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden" animationType="fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">Meet The Developer</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed">The person behind SnippifyX</p>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <div className="group h-96" style={{ perspective: '1000px' }}>
                  <div
                    className="relative w-full h-full transition-transform duration-700"
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateY(0deg)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotateY(180deg)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotateY(0deg)'; }}
                  >
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                      <div className="h-full bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-32 mb-6 rounded-full overflow-hidden shadow-2xl border-4 border-blue-200">
                          <img
                            src="/yasir.jpg"
                            alt="Yasir Jabbar"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 gradient-text">Yasir Jabbar</h3>
                        <div className="text-blue-600 mb-4 text-lg font-semibold">Full Stack Developer & Founder</div>
                        <div className="text-gray-500 text-sm">Hover to see more</div>
                      </div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                      <div className="h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center text-white">
                        <div className="w-16 h-16 mb-6 rounded-full bg-white/20 flex items-center justify-center">
                          <FiUsers className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Yasir Jabbar</h3>
                        <div className="text-blue-200 mb-4 text-sm font-semibold">Full Stack Developer & Founder</div>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6">
                          A passionate software engineer who built SnippifyX to help developers and creators
                          organize and share their code snippets efficiently.
                        </p>
                        <div className="flex gap-4 mb-4">
                          <a
                            href="https://github.com/ranayasir-90"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                          <a
                            href="https://linkedin.com/in/yasir-jabbar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        </div>
                        <div className="text-blue-200 text-xs">Hover to flip back</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden" animationType="fade-in">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Join the SnippifyX Community
            </h2>
            <p className="text-2xl mb-12 opacity-90 leading-relaxed">
              Be part of the future of content creation. Start organizing your content today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button
                size="lg"
                className="text-xl px-12 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl transition-all duration-300 group"
                onClick={() => router.push('/signup')}
              >
                <FiZap className="mr-3 h-6 w-6" />
                Get Started Free
                <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 group"
                onClick={() => router.push('/contact')}
              >
                <FiMail className="mr-3 h-6 w-6" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </MarketingLayout>
  );
}