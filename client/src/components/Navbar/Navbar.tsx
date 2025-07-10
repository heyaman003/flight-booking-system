'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plane, Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Search Flights", href: "/search" },
    { name: "My Profile", href: "/profile" },
  ];

  // Close dropdown on outside click
  // (basic implementation, can be improved with useEffect for event listeners)
  function handleUserDropdownBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setUserDropdownOpen(false);
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FlightBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isActive(item.href)
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-700"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" tabIndex={0} ref={userDropdownRef} onBlur={handleUserDropdownBlur}>
                <button
                  className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setUserDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <User className="h-5 w-5" />
                  <span>Welcome, {user?.firstName}</span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-fade-in" tabIndex={-1}>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm flex items-center"
                      onClick={() => { setUserDropdownOpen(false); logout(); }}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/login')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.slice(0, 2).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 text-sm text-gray-700 px-3 py-2 rounded hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={() => { setIsMenuOpen(false); logout(); }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" onClick={() => router.push('/login')}>Sign In</Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/login')}>Sign Up</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
