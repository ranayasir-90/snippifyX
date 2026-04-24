"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { FiMail, FiShield, FiLock } from "react-icons/fi";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function PrivacyPage() {
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
                  <FiShield className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-600 font-medium">Privacy & Security</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in-up animation-delay-200">
                  Privacy Policy
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                </p>
                <div className="text-sm text-gray-500 mt-4 animate-fade-in-up animation-delay-600">
                  Last updated: January 15, 2024
                </div>
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
                <div className="prose prose-lg max-w-none">
                  {/* Each section below can be further wrapped in AnimatedSection for staggered animation if desired */}
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">1. Information We Collect</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Account Information</h3>
                        <p>When you create an account, we collect:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Email address</li>
                          <li>Name (optional)</li>
                          <li>Profile picture (optional)</li>
                          <li>Account preferences</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
                        <p>We automatically collect:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Pages visited and features used</li>
                          <li>Device information (browser, OS, IP address)</li>
                          <li>Performance and error data</li>
                          <li>Search queries and interactions</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Content You Create</h3>
                        <p>We store the snippets, folders, and tags you create to provide our service.</p>
                      </div>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">2. How We Use Your Information</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Service Provision</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Provide and maintain our snippet management service</li>
                          <li>Process your requests and transactions</li>
                          <li>Send service-related communications</li>
                          <li>Provide customer support</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Improvement & Analytics</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Analyze usage patterns to improve our service</li>
                          <li>Develop new features and functionality</li>
                          <li>Ensure security and prevent fraud</li>
                          <li>Comply with legal obligations</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">3. Information Sharing</h2>
                    <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Service Providers:</strong> With trusted partners who help us operate our service (hosting, analytics, customer support)</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                      <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                      <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                    </ul>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">4. Data Security</h2>
                    <div className="space-y-4">
                      <p>We implement industry-standard security measures to protect your data:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Encryption in transit and at rest</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls and authentication</li>
                        <li>Secure data centers and infrastructure</li>
                        <li>Employee training on data protection</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">5. Cookies and Tracking</h2>
                    <div className="space-y-4">
                      <p>We use cookies and similar technologies to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Remember your preferences and settings</li>
                        <li>Analyze website traffic and usage</li>
                        <li>Provide personalized content and features</li>
                        <li>Ensure security and prevent fraud</li>
                      </ul>
                      <p>You can control cookie settings through your browser preferences.</p>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">6. Your Rights</h2>
                    <div className="space-y-4">
                      <p>You have the right to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Rectification:</strong> Correct inaccurate information</li>
                        <li><strong>Erasure:</strong> Request deletion of your data</li>
                        <li><strong>Portability:</strong> Export your data in a standard format</li>
                        <li><strong>Objection:</strong> Object to certain processing activities</li>
                        <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                      </ul>
                      <p>To exercise these rights, contact us at privacy@SnippifyX.com</p>
                    </div>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">7. Data Retention</h2>
                    <p>We retain your data for as long as necessary to provide our service and comply with legal obligations. Account data is typically retained for 3 years after account deletion, while usage logs are retained for 12 months.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">8. International Transfers</h2>
                    <p>Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">9. Children's Privacy</h2>
                    <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">10. Changes to This Policy</h2>
                    <p>We may update this privacy policy from time to time. We will notify you of any material changes by email or through our service. Your continued use of our service after such changes constitutes acceptance of the updated policy.</p>
                  </section>

                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 gradient-text">11. Contact Us</h2>
                    <div className="bg-gray-50/70 rounded-lg p-6 border border-white/20">
                      <p className="mb-4">If you have questions about this privacy policy or our data practices, please contact us:</p>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> privacy@SnippifyX.com</p>
                        <p><strong>Address:</strong> SnippifyX Privacy Team, [Your Business Address]</p>
                        <p><strong>Data Protection Officer:</strong> dpo@SnippifyX.com</p>
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
                  <FiMail className="mr-2 h-5 w-5" />
                  Contact Our Privacy Team
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
} 