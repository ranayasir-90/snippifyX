"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiSend, FiCheckCircle, FiClock, FiMessageCircle, FiShield, FiUsers, FiArrowRight } from "react-icons/fi";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useError } from "@/contexts/ErrorContext";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { showError } = useError();
  const { user, loading } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const formValues = watch();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSendEmail = () => {
    const { name, email, subject, message } = formValues;
    
    // Validate form before sending
    if (!name || !email || !subject || !message) {
      showError("Please fill in all required fields before sending the message.");
      return;
    }

    // Create mailto link with pre-filled content
    const mailtoLink = `mailto:support@SnippifyX.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
  };

  const contactInfo = [
    {
      icon: <FiMail className="h-6 w-6" />,
      title: "Email Us",
      details: "support@SnippifyX.com",
      description: "Get help with your account or technical issues",
      color: "blue",
    },
    {
      icon: <FiPhone className="h-6 w-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Speak with our customer support team",
      color: "green",
    },
    {
      icon: <FiMapPin className="h-6 w-6" />,
      title: "Visit Us",
      details: "123 Innovation Street, Tech City, TC 12345",
      description: "Our headquarters and main office",
      color: "purple",
    },
  ];

  const faqs = [
    {
      question: "How do I get started with SnippifyX?",
      answer: "Yes! You can use SnippifyX for free with up to 50 snippets and 3 folders. Upgrade to Pro for unlimited access.",
    },
    {
      question: "Can I share my snippets publicly?",
      answer: "Yes! You can make any snippet public and share it with the community. Other developers can view and use your public snippets.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and security measures to protect your data. Your private snippets remain private.",
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! You can use SnippifyX for free with up to 50 snippets and 3 folders. Upgrade to Pro for unlimited access.",
    },
  ];

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        {/* Hero Section */}
        <AnimatedSection>
          <section className="relative py-32">
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                
                <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in-up animation-delay-200">
                  Get in <span className="gradient-text">Touch</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-400">
                  Have questions about SnippifyX? Need support? Want to partner with us? 
                  We're here to help and would love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.location.href = 'mailto:support@SnippifyX.com'}
                  >
                    <FiMail className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                  
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Contact Information */}
        <AnimatedSection>
          <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                    Multiple Ways to Connect
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Choose the best way to reach us based on your needs
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* General Inquiries */}
                  <div className="group relative p-8 rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <FiMail className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800">General Inquiries</h3>
                      <p className="text-gray-600 mb-6">
                        Questions about our service, features, or pricing
                      </p>
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-600">hello@SnippifyX.com</p>
                        <p className="text-sm text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Support */}
                  <div className="group relative p-8 rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <FiShield className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800">Technical Support</h3>
                      <p className="text-gray-600 mb-6">
                        Help with technical issues or account problems
                      </p>
                      <div className="space-y-2">
                        <p className="font-semibold text-green-600">support@SnippifyX.com</p>
                        <p className="text-sm text-gray-500">Response within 4 hours</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Development */}
                  <div className="group relative p-8 rounded-3xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                        <FiUsers className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800">Business Development</h3>
                      <p className="text-gray-600 mb-6">
                        Partnerships, enterprise sales, or media inquiries
                      </p>
                      <div className="space-y-2">
                        <p className="font-semibold text-purple-600">business@SnippifyX.com</p>
                        <p className="text-sm text-gray-500">Response within 48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection>
          <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                    Send us a Message
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Fill out the form below and we'll get back to you as soon as possible
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  {/* Form */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-gray-700">First Name *</label>
                          <Input 
                            {...register("name")}
                            type="text" 
                            placeholder="John" 
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-3 text-gray-700">Last Name</label>
                          <Input 
                            type="text" 
                            placeholder="Doe" 
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700">Email *</label>
                        <Input 
                          {...register("email")}
                          type="email" 
                          placeholder="john@example.com" 
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" 
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700">Subject *</label>
                        <select 
                          {...register("subject")}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Business Partnership">Business Partnership</option>
                          <option value="Feature Request">Feature Request</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700">Message *</label>
                        <textarea 
                          {...register("message")}
                          rows={6}
                          placeholder="Tell us how we can help you..."
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                        ></textarea>
                        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                      </div>
                      
                      <Button 
                        type="button" 
                        size="lg" 
                        onClick={handleSendEmail}
                        className="w-full py-4 text-lg font-semibold btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <FiSend className="mr-2 h-5 w-5" />
                        Send Message via Email
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Ready to Get Started?
                </h2>
                <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
                  Join thousands of creators who are already using SnippifyX to organize their content.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button size="lg" variant="secondary" className="text-lg px-10 py-4 btn-animate hover-lift bg-white text-blue-600 hover:bg-gray-100" onClick={() => router.push('/signup')}>
                    Get Started Now
                  </Button>
                  
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </MarketingLayout>
  );
} 