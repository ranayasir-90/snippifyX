"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { FiFileText, FiShield, FiAlertTriangle } from "react-icons/fi";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function TermsPage() {
  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <AnimatedSection>
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-700 mb-6 animate-fade-in-up">
                  <FiFileText className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-600 font-medium">Terms & Conditions</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in-up animation-delay-200">
                  Terms of Service
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                  Please read these terms carefully before using our service.
                </p>
                <div className="text-sm text-gray-500 mt-4 animate-fade-in-up animation-delay-600">
                  Last updated: January 15, 2024
                </div>
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection>
              <div className="group relative bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 prose prose-lg max-w-none">
                  {/* Each section below can be further wrapped in AnimatedSection for staggered animation if desired */}
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">1. Acceptance of Terms</h2>
                    <p>By accessing and using SnippifyX ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">2. Description of Service</h2>
                    <p>SnippifyX is a snippet management platform that allows users to save, organize, and share code snippets and text content. The service includes:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                      <li>Personal snippet storage and organization</li>
                      <li>Folder and tag management</li>
                      <li>Public sharing capabilities</li>
                      <li>AI-powered suggestions and features</li>
                      <li>Cross-platform access</li>
                    </ul>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">3. User Accounts</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Account Creation</h3>
                        <p>To use certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Account Security</h3>
                        <p>You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Account Termination</h3>
                        <p>We reserve the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion.</p>
                      </div>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">4. Acceptable Use Policy</h2>
                    <div className="space-y-4">
                      <p>You agree not to use the Service to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Upload, store, or share content that is illegal, harmful, threatening, abusive, or defamatory</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe upon the intellectual property rights of others</li>
                        <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                        <li>Use the service for spam, phishing, or other malicious activities</li>
                        <li>Interfere with or disrupt the Service or servers</li>
                        <li>Share content that contains viruses, malware, or other harmful code</li>
                        <li>Use automated systems to access the Service without permission</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">5. Content Ownership and Licensing</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Your Content</h3>
                        <p>You retain ownership of the content you create and upload to the Service. By uploading content, you grant us a limited license to store, process, and display your content as necessary to provide the Service.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Public Content</h3>
                        <p>When you share content publicly, you grant other users a license to view and use that content in accordance with our sharing settings and these terms.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Our Content</h3>
                        <p>The Service, including its original content, features, and functionality, is owned by SnippifyX and is protected by international copyright, trademark, and other intellectual property laws.</p>
                      </div>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">6. Privacy and Data Protection</h2>
                    <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. By using the Service, you consent to our collection and use of information as described in our Privacy Policy.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">7. Service Availability and Modifications</h2>
                    <div className="space-y-4">
                      <p>We strive to provide a reliable service but cannot guarantee uninterrupted availability. We may:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Modify, suspend, or discontinue the Service at any time</li>
                        <li>Update features and functionality</li>
                        <li>Perform maintenance that may temporarily affect service availability</li>
                      </ul>
                      <p>We will provide reasonable notice for significant changes that affect your use of the Service.</p>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">8. Pricing and Payment</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Free Tier</h3>
                        <p>We offer a free tier with basic features. Free tier users are subject to usage limits and feature restrictions.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Premium Plans</h3>
                        <p>Premium plans are available for additional features and higher usage limits. Pricing and features are subject to change with notice.</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Payment Terms</h3>
                        <p>Premium subscriptions are billed in advance on a recurring basis. You may cancel your subscription at any time, and you will continue to have access until the end of your billing period.</p>
                      </div>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">9. Disclaimers and Limitations</h2>
                    <div className="space-y-4">
                      <div className="group relative bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <div className="flex items-start gap-3">
                            <div className="group-hover:scale-110 transition-transform duration-500">
                              <FiAlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
                              <ul className="space-y-2 text-yellow-700">
                                <li>The Service is provided "as is" without warranties of any kind</li>
                                <li>We do not guarantee the accuracy, completeness, or usefulness of any content</li>
                                <li>We are not responsible for any loss of data or content</li>
                                <li>We do not guarantee that the Service will be error-free or uninterrupted</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p>In no event shall SnippifyX be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">10. Indemnification</h2>
                    <p>You agree to defend, indemnify, and hold harmless SnippifyX and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these terms.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">11. Governing Law and Dispute Resolution</h2>
                    <p>These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms or your use of the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">12. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. We will notify users of material changes by email or through the Service. Your continued use of the Service after such changes constitutes acceptance of the updated terms.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">13. Contact Information</h2>
                    <div className="group relative bg-gray-50/70 rounded-lg p-6 border border-white/20 hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <p className="mb-4">If you have questions about these terms, please contact us:</p>
                        <div className="space-y-2">
                          <p><strong>Email:</strong> legal@SnippifyX.com</p>
                          <p><strong>Address:</strong> SnippifyX Legal Team, [Your Business Address]</p>
                          <p><strong>Support:</strong> support@SnippifyX.com</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection>
              <div className="text-center mt-12">
                <Button size="lg" className="btn-animate hover-lift bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg font-semibold">
                  <FiShield className="mr-2 h-5 w-5" />
                  Contact Legal Team
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 