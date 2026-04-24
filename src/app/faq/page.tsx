"use client";

import MarketingLayout from "@/layouts/MarketingLayout";
import { Button } from "@/components/ui/button";
import { FiHelpCircle, FiSearch, FiMail, FiMessageCircle, FiBook, FiShield, FiZap, FiUsers } from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FAQPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: <FiZap className="w-6 h-6" />,
      questions: [
        {
          question: "How do I create my first snippet?",
          answer: "Creating your first snippet is easy! Simply click the 'New Snippet' button, choose your programming language, paste your code, add a title and description, and save. You can also add tags and organize it into folders for better management."
        },
        {
          question: "Is SnippifyX free to use?",
          answer: "Yes! SnippifyX offers a generous free tier that includes up to 100 snippets, basic organization features, and community support. You can upgrade to Pro or Enterprise plans for additional features and higher limits."
        },
        {
          question: "What programming languages do you support?",
          answer: "SnippifyX supports over 100 programming languages including JavaScript, Python, Java, C++, PHP, Ruby, Go, Rust, and many more. We use industry-standard syntax highlighting for accurate code display."
        },
        {
          question: "Can I import my existing code snippets?",
          answer: "Absolutely! You can import snippets from various sources including GitHub Gists, local files, or other snippet managers. We support multiple import formats including JSON, CSV, and plain text files."
        }
      ]
    },
    {
      title: "Account & Security",
      icon: <FiShield className="w-6 h-6" />,
      questions: [
        {
          question: "How secure is my data?",
          answer: "Your data security is our top priority. We use enterprise-grade encryption (AES-256) for data in transit and at rest. All data is stored in secure, SOC 2 compliant data centers with regular security audits."
        },
        {
          question: "Can I export my data?",
          answer: "Yes, you have full control over your data. You can export your snippets in multiple formats including JSON, CSV, Markdown, or plain text. We also provide a complete data export feature for account deletion."
        },
        {
          question: "What happens if I delete my account?",
          answer: "When you delete your account, all your data is permanently removed from our servers within 30 days. You'll receive a confirmation email, and you can download your data before deletion if needed."
        },
        {
          question: "Do you share my data with third parties?",
          answer: "No, we never sell or share your personal data with third parties. We only use your data to provide our service and may share it with trusted service providers who help us operate SnippifyX (like hosting providers)."
        }
      ]
    },
    {
      title: "Features & Usage",
      icon: <FiBook className="w-6 h-6" />,
      questions: [
        {
          question: "How does the AI-powered search work?",
          answer: "Our AI search understands the context and meaning of your code, not just keywords. It can find snippets based on functionality, language patterns, and even comments. The more you use it, the better it gets at understanding your coding style."
        },
        {
          question: "Can I share snippets with my team?",
          answer: "Yes! Pro and Enterprise plans include team collaboration features. You can create team workspaces, share snippets with specific team members, and collaborate on code together with real-time updates."
        },
        {
          question: "Is there a mobile app?",
          answer: "SnippifyX is fully responsive and works great on mobile devices. While we don't have a native mobile app yet, you can access all features through your mobile browser with full functionality."
        },
        {
          question: "Can I use SnippifyX offline?",
          answer: "Currently, SnippifyX requires an internet connection to sync your data. However, we're working on offline capabilities that will allow you to view and edit snippets without an internet connection."
        }
      ]
    },
    {
      title: "Billing & Plans",
      icon: <FiUsers className="w-6 h-6" />,
      questions: [
        {
          question: "What's included in the free plan?",
          answer: "The free plan includes up to 100 snippets, basic organization with folders, simple search, community support, basic export options, and mobile access. It's perfect for individual developers getting started."
        },
        {
          question: "Can I upgrade or downgrade my plan?",
          answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing period. You'll only pay for the time you use each plan."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with SnippifyX, contact our support team within 30 days of your purchase for a full refund."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans. All payments are processed securely through Stripe."
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our expert support team",
      icon: <FiMessageCircle className="w-6 h-6" />,
      action: "Contact Us",
      href: "/contact"
    },
    {
      title: "View Documentation",
      description: "Detailed guides and tutorials",
      icon: <FiBook className="w-6 h-6" />,
      action: "Read Docs",
      href: "/docs"
    },
    
  ];

  const { showError } = useError();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <FiHelpCircle className="w-4 h-4 text-blue-400 mr-2" />
                We're here to help
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Find answers to common questions about SnippifyX. Can't find what you're looking for? 
                Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    className="pl-10 pr-4 py-3 w-full sm:w-80 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-4 btn-animate hover-lift"
                  onClick={() => window.location.href = 'mailto:your-email@gmail.com?subject=SnippifyX Support Request&body=Hello,%0D%0A%0D%0AI need help with SnippifyX. Please provide details about your issue below:%0D%0A%0D%0A[Describe your issue here]%0D%0A%0D%0AThank you!'}
                >
                  <FiMail className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="group relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        {category.icon}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="group relative bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <h3 className="text-lg font-semibold mb-3 text-gray-900">
                            {faq.question}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Still Need Help?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our support team is here to help you succeed
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {quickActions.map((action, index) => (
                  <div key={index} className="group relative bg-white rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                        {action.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{action.title}</h3>
                      <p className="text-muted-foreground mb-6">{action.description}</p>
                      <Button variant="outline" className="btn-animate hover-lift">
                        {action.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Can't Find Your Answer?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Our expert support team is available 24/7 to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-4 btn-animate hover-lift"
                  onClick={() => window.location.href = 'mailto:your-email@gmail.com?subject=SnippifyX Support Request&body=Hello,%0D%0A%0D%0AI need help with SnippifyX. Please provide details about your issue below:%0D%0A%0D%0A[Describe your issue here]%0D%0A%0D%0AThank you!'}
                >
                  <FiMail className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
                
              </div>
              <div className="mt-8 text-sm opacity-75">
                <p>Average response time: 2-4 hours</p>
                <p>Customer satisfaction: 98%</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
} 