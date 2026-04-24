"use client";
import { useEffect, useState } from "react";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/layouts/AdminLayout";
import { snippetService, folderService, tagService } from "@/lib/firebaseServices";
import { FiFileText, FiFolder, FiTag, FiSettings, FiHelpCircle } from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    snippets: 0,
    folders: 0,
    tags: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [snippets, folders, tags] = await Promise.all([
          snippetService.getAll(),
          folderService.getAll(),
          tagService.getAll(),
        ]);
        setStats({
          snippets: snippets.length,
          folders: folders.length,
          tags: tags.length,
        });
      } catch (e) {
        setStats({ snippets: 0, folders: 0, tags: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const links = [
    { href: "/admin/snippets", icon: <FiFileText className="h-6 w-6" />, label: "Snippets" },
    { href: "/admin/folders", icon: <FiFolder className="h-6 w-6" />, label: "Folders" },
    { href: "/admin/tags", icon: <FiTag className="h-6 w-6" />, label: "Tags" },
    { href: "/admin/settings", icon: <FiSettings className="h-6 w-6" />, label: "Settings" },
    { href: "/admin/support", icon: <FiHelpCircle className="h-6 w-6" />, label: "Support" },
  ];

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">Welcome, Super Admin! Manage content and app settings from one place.</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex flex-col items-center">
              <FiFileText className="h-8 w-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-900">{loading ? "-" : stats.snippets}</div>
              <div className="text-xs text-purple-600">Snippets</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 flex flex-col items-center">
              <FiFolder className="h-8 w-8 text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-900">{loading ? "-" : stats.folders}</div>
              <div className="text-xs text-yellow-600">Folders</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 flex flex-col items-center">
              <FiTag className="h-8 w-8 text-indigo-600 mb-2" />
              <div className="text-2xl font-bold text-indigo-900">{loading ? "-" : stats.tags}</div>
              <div className="text-xs text-indigo-600">Tags</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="block p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-200 group">
                <div className="flex items-center gap-4 mb-2">
                  <span className="p-3 rounded-xl bg-gray-100 group-hover:bg-blue-100 transition-colors">
                    {link.icon}
                  </span>
                  <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{link.label}</span>
                </div>
                <div className="text-xs text-gray-500">Go to {link.label} management</div>
              </Link>
            ))}
          </div>
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
} 