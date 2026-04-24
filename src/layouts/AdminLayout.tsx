import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome, FiFileText, FiFolder, FiTag, FiSettings, FiHelpCircle, FiBell
} from "react-icons/fi";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: <FiHome /> },
  { name: "Snippets", href: "/admin/snippets", icon: <FiFileText /> },
  { name: "Folders", href: "/admin/folders", icon: <FiFolder /> },
  { name: "Tags", href: "/admin/tags", icon: <FiTag /> },
  { name: "Notifications", href: "/admin/notifications", icon: <FiBell /> },
  { name: "Settings", href: "/admin/settings", icon: <FiSettings /> },
  { name: "Support", href: "/admin/support", icon: <FiHelpCircle /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 min-h-screen">
        <div className="mb-10 flex items-center gap-2 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
            <FiHome className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-base
                hover:bg-blue-50 hover:text-blue-700
                ${pathname === item.href ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 