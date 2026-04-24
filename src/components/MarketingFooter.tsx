"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  FiGithub, 
  FiTwitter, 
  FiLinkedin, 
  FiMail, 
  FiHeart, 
  FiArrowRight,
  FiZap,
  FiShield,
  FiUsers,
  FiStar,
  FiMessageCircle,
  FiBook,
  FiHelpCircle,
  FiFileText,
  FiLock,
  FiGlobe,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";

export default function MarketingFooter() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const footerLinks = {
    product: [
      { name: "Features", href: "/features", icon: FiZap },
      { name: "Community", href: "/public", icon: FiUsers },
    ],
    company: [
      { name: "About", href: "/about", icon: FiStar },
      { name: "Blog", href: "/blog", icon: FiFileText },
      { name: "Contact", href: "/contact", icon: FiMail },
      { name: "Status", href: "/status", icon: FiGlobe },
    ],
    support: [
      { name: "Documentation", href: "/docs", icon: FiBook },
      { name: "FAQ", href: "/faq", icon: FiHelpCircle },
      { name: "Contact Support", href: "/contact", icon: FiMessageCircle },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy", icon: FiShield },
      { name: "Terms of Service", href: "/terms", icon: FiLock },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/SnippifyX", icon: FiTwitter },
    { name: "GitHub", href: "https://github.com/SnippifyX", icon: FiGithub },
    { name: "LinkedIn", href: "https://linkedin.com/company/SnippifyX", icon: FiLinkedin },
    { name: "Email", href: "mailto:hello@SnippifyX.com", icon: FiMail },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          {/* Brand Section - Always Visible */}
          <div className="text-center lg:text-left mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="SnippetX Logo" className="w-12 h-12 rounded-xl shadow-lg" />
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    SnippifyX
                  </h3>
                  <p className="text-sm text-gray-400">Organize. Share. Create.</p>
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                  The ultimate platform for organizing and sharing your content snippets. 
                  Built for creators, developers, and teams who want to work smarter.
                </p>
              </div>
            </div>
            
            {/* Social Links - Mobile Optimized */}
            <div className="flex justify-center lg:justify-start items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg active:scale-95"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections - Mobile Collapsible */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section} className="border border-gray-800 rounded-xl p-4 lg:p-0 lg:border-0">
                {/* Section Header - Collapsible on Mobile */}
                <button
                  onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between lg:justify-start lg:mb-6 text-left py-2 lg:py-0 touch-manipulation"
                >
                  <h4 className="text-lg font-semibold text-white capitalize">
                    {section}
                  </h4>
                  <div className="lg:hidden">
                    {isExpanded(section) ? (
                      <FiChevronUp className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                </button>

                {/* Links List */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded(section) || !isMobile ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-96 lg:opacity-100'
                }`}>
                  <ul className="space-y-3 pb-2">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group py-3 lg:py-1 px-2 rounded-lg hover:bg-white/5 active:bg-white/10"
                        >
                          <link.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                          <span className="flex-1">{link.name}</span>
                          <FiArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile Optimized */}
      <div className="relative z-10 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright and Made with Love */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400 text-center lg:text-left">
              <span>© 2024 SnippifyX. All rights reserved.</span>
              
            </div>

            {/* Trust Indicators - Mobile Stacked */}
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400 px-3 py-1 rounded-lg bg-white/5">
                <FiShield className="w-4 h-4 text-green-400" />
                <span className="hidden sm:inline">GDPR Compliant</span>
                <span className="sm:hidden">GDPR</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 px-3 py-1 rounded-lg bg-white/5">
                <FiLock className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">256-bit SSL</span>
                <span className="sm:hidden">SSL</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 px-3 py-1 rounded-lg bg-white/5">
                <FiGlobe className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">99.9% Uptime</span>
                <span className="sm:hidden">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
