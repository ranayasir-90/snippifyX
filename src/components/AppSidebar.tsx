"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import {
  FiHome,
  FiFileText,
  FiShare2,
  FiSettings,
  FiFolder,
  FiTag,
  FiCopy,
  FiGrid,
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiZap,
  FiX,
  FiMenu,
  FiHeart
} from "react-icons/fi";

interface AppSidebarProps {
  open: boolean;
  expanded?: boolean;
  onClose: () => void;
  onToggleExpanded?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isMobile?: boolean;
}

export default function AppSidebar({ 
  open, 
  expanded = false, 
  onClose, 
  onToggleExpanded,
  onMouseEnter,
  onMouseLeave,
  isMobile = false
}: AppSidebarProps) {
  const pathname = usePathname();
  const { user: authUser } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navigationItems = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <FiHome className="h-5 w-5" />,
          description: "Overview and analytics",
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          name: "Snippets",
          href: "/snippets",
          icon: <FiFileText className="h-5 w-5" />,
          description: "Manage your code snippets",
        },
        {
          name: "Shared",
          href: "/shared",
          icon: <FiShare2 className="h-5 w-5" />,
          description: "Shared and public snippets",
        },
        {
          name: "Public Snippets",
          href: "/public",
          icon: <FiUsers className="h-5 w-5" />,
          description: "Browse community snippets",
        },
        {
          name: "Likes",
          href: "/likes",
          icon: <FiHeart className="h-5 w-5" />,
          description: "Your liked snippets",
        },
      ],
    },
    {
      title: "Organize",
      items: [
        {
          name: "Folders",
          href: "/folders",
          icon: <FiFolder className="h-5 w-5" />,
          description: "Organize with folders",
        },
        {
          name: "Tags",
          href: "/tags",
          icon: <FiTag className="h-5 w-5" />,
          description: "Manage tags and categories",
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          name: "Analytics",
          href: "/analytics",
          icon: <FiTrendingUp className="h-5 w-5" />,
          description: "Usage statistics",
        },
      ],
    },
  ];

  // Mobile version - Full overlay sidebar
  if (isMobile) {
    return (
      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
          <Dialog.Content className="fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden">
            {/* Accessibility elements - hidden visually but available to screen readers */}
            <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
            <Dialog.Description className="sr-only">Main navigation menu for SnippifyX application</Dialog.Description>
            
            {/* Header with close button */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/logo.png" alt="SnippetX Logo" className="w-8 h-8 rounded-xl" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-label="Close sidebar"
                >
                  <FiX className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-2 px-2">
                {navigationItems.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                            isActive(item.href)
                              ? "bg-gray-100 text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={onClose}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  // Desktop version - YouTube style with expandable sidebar
  if (open) {
    return (
      <div 
        className={`bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-150 ease-in-out ${
          expanded ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo/Hamburger */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={onToggleExpanded}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? (
                <FiX className="h-5 w-5 text-blue-600" />
              ) : (
                <FiMenu className="h-5 w-5 text-blue-600" />
              )}
            </button>
            {expanded && (
              <span className="ml-3 text-xl font-bold gradient-text whitespace-nowrap">SnippifyX</span>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-2">
            {navigationItems.map((section) => (
              <div key={section.title}>
                {expanded && (
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 px-1">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      title={!expanded ? item.name : undefined}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0">
                        {item.icon}
                      </div>
                      {expanded && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Return null for mobile when closed
  return null;
}