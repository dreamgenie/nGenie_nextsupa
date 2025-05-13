"use client"

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { useState, useEffect } from "react"
import { Search, Grid, FileText, User, Bell, Menu, X, ChevronDown, ChevronUp, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)

      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen w-full overflow-hidden relative">
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMobileMenu} />}

          {/* Left Sidebar */}
          <div
            className={`bg-primary-light flex flex-col ${
              isMobile
                ? `fixed h-full z-50 transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? "w-4/5 translate-x-0" : "w-0 -translate-x-full"
                  } shadow-lg`
                : "w-64 relative"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="relative h-16 w-16">
                  <div className="text-white font-bold text-3xl">N</div>
                  <div className="absolute top-0 right-0 h-4 w-4 bg-primary-light"></div>
                </div>
                <div className="ml-2">
                  <div className="text-white font-bold">Network</div>
                  <div className="text-primary-light text-sm">Genie</div>
                </div>
              </div>

              {/* Close button for mobile menu */}
              {isMobile && (
                <button className="text-white bg-transparent border-none cursor-pointer p-2" onClick={toggleMobileMenu}>
                  <X size={24} />
                </button>
              )}
            </div>

            <div className="px-4 py-2">
              <div className="bg-white/20 rounded-full flex items-center px-4 py-2">
                <Search className="h-5 w-5 text-white/70" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none text-white ml-2 w-full outline-none"
                />
              </div>
            </div>

            <nav className="mt-6 flex-1 overflow-y-auto">
              <Link
                href="/"
                className={`mx-2 rounded-full py-3 px-4 flex items-center mb-3 ${
                  pathname === "/" ? "bg-white/30" : hoveredItem === "dashboard" ? "bg-white/10" : "bg-transparent"
                } cursor-pointer`}
                onMouseEnter={() => setHoveredItem("dashboard")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Grid className={`h-5 w-5 ${pathname === "/" ? "text-white" : "text-white/70"} mr-3`} />
                <span className={`${pathname === "/" ? "text-white" : "text-white/70"} font-medium`}>Dashboard</span>
              </Link>

              <Link
                href="/task-reminders"
                className={`mx-2 rounded-full py-3 px-4 flex items-center mb-3 ${
                  pathname === "/task-reminders"
                    ? "bg-white/30"
                    : hoveredItem === "task"
                      ? "bg-white/10"
                      : "bg-transparent"
                } cursor-pointer`}
                onMouseEnter={() => setHoveredItem("task")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <FileText
                  className={`h-5 w-5 ${pathname === "/task-reminders" ? "text-white" : "text-white/70"} mr-3`}
                />
                <span className={`${pathname === "/task-reminders" ? "text-white" : "text-white/70"} font-medium`}>
                  Task Reminders
                </span>
              </Link>

              <Link
                href="/customer"
                className={`mx-2 rounded-full py-3 px-4 flex items-center mb-3 ${
                  pathname === "/customer"
                    ? "bg-white/30"
                    : hoveredItem === "customer"
                      ? "bg-white/10"
                      : "bg-transparent"
                } cursor-pointer`}
                onMouseEnter={() => setHoveredItem("customer")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <User className={`h-5 w-5 ${pathname === "/customer" ? "text-white" : "text-white/70"} mr-3`} />
                <span className={`${pathname === "/customer" ? "text-white" : "text-white/70"} font-medium`}>
                  Customer
                </span>
              </Link>

              <Link
                href="/genie-notification"
                className={`mx-2 rounded-full py-3 px-4 flex items-center mb-3 ${
                  pathname === "/genie-notification"
                    ? "bg-white/30"
                    : hoveredItem === "notification"
                      ? "bg-white/10"
                      : "bg-transparent"
                } cursor-pointer`}
                onMouseEnter={() => setHoveredItem("notification")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Bell
                  className={`h-5 w-5 ${pathname === "/genie-notification" ? "text-white" : "text-white/70"} mr-3`}
                />
                <span className={`${pathname === "/genie-notification" ? "text-white" : "text-white/70"} font-medium`}>
                  Genie Notification
                </span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="bg-darkBlue flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-darkerBlue">
              {/* Mobile menu toggle */}
              {isMobile && (
                <button
                  className="bg-transparent border-none text-white cursor-pointer p-2 mr-2"
                  onClick={toggleMobileMenu}
                >
                  <Menu size={24} />
                </button>
              )}

              <div className="flex-1">
                <h1 className="text-white font-bold text-xl md:text-2xl">Welcome Back, Smith 👋</h1>
                <p className="text-gray-400 text-xs md:text-sm">YOUR NETWORK IS YOUR NETWORTH</p>
              </div>

              <div className="relative">
                <button className="flex items-center bg-transparent border-none cursor-pointer" onClick={toggleMenu}>
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-0 md:mr-2">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  {!isMobile && (
                    <>
                      <div className="mr-2">
                        <div className="text-white font-medium">Adam Smith</div>
                        <div className="text-gray-400 text-sm">Account</div>
                      </div>
                      {isMenuOpen ? (
                        <ChevronUp className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white" />
                      )}
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-primary rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-4 flex justify-end">
                      <Settings className="h-6 w-6 text-white" />
                    </div>

                    <div className="px-4 pb-4 flex flex-col gap-3">
                      {[
                        "SETTINGS",
                        "YOUR PROFILE",
                        "WHATS NEW",
                        "BILLING",
                        "THEME: LIGHT",
                        "HELP & RESOURCES",
                        "LOG OUT",
                      ].map((item, index) => (
                        <button
                          key={index}
                          className={`bg-white/20 rounded-lg p-3 w-full text-center text-white font-medium border-none cursor-pointer ${
                            hoveredItem === `menu-${index}` ? "bg-white/30" : "bg-white/20"
                          } transition-colors`}
                          onMouseEnter={() => setHoveredItem(`menu-${index}`)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 flex justify-end">
                      <div className="relative h-16 w-16">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/network_genie-ujDSwZ1J8IomV4CWI5ltPVlqidaH5S.png"
                          alt="Genie Character"
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 relative overflow-hidden">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
