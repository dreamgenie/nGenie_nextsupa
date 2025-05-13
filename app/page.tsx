"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Grid,
  FileText,
  User,
  Bell,
  Map,
  LayoutGrid,
  MessageSquare,
  Users,
  Video,
  Calendar,
  Network,
  ContactIcon,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react"
import Image from "next/image"
import MapView from "@/components/map-view"
import BoxView from "@/components/box-view"
import GenieChat from "@/components/genie-chat"
import ConnectionMirror from "@/components/connection-mirror"
import LiveNetworking from "@/components/live-networking"
import CalendarView from "@/components/calendar-view"
import NeuralView from "@/components/neural-view"
import AllContacts from "@/components/all-contacts"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("MAP VIEW")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  // Remove the activePage state
  // const [activePage, setActivePage] = useState<"dashboard" | "tasks" | "customer" | "notification">("dashboard")

  // Add pathname for active route detection
  const pathname = usePathname()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
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

  // Render the active tab content
  // Remove this code
  // const renderTabContent = () => {
  //   if (activePage !== "dashboard") {
  //     switch (activePage) {
  //       case "tasks":
  //         return <TaskReminders />
  //       case "customer":
  //         return <Customer />
  //       case "notification":
  //         return <GenieNotification />
  //     }
  //   }

  //   switch (activeTab) {
  //     case "MAP VIEW":
  //       return <MapView />
  //     case "BOX VIEW":
  //       return <BoxView />
  //     case "GENIE CHAT":
  //       return <GenieChat />
  //     case "CONNECTION MIRROR":
  //       return <ConnectionMirror />
  //     case "LIVE NETWORKING":
  //       return <LiveNetworking />
  //     case "CALENDAR":
  //       return <CalendarView />
  //     case "NEURAL VIEW":
  //       return <NeuralView />
  //     case "ALL CONTACTS":
  //       return <AllContacts />
  //     default:
  //       return <MapView />
  //   }
  // }

  // Tab data with icons
  const tabs = [
    { name: "MAP VIEW", icon: <Map size={16} /> },
    { name: "BOX VIEW", icon: <LayoutGrid size={16} /> },
    { name: "GENIE CHAT", icon: <MessageSquare size={16} /> },
    { name: "CONNECTION MIRROR", icon: <Users size={16} /> },
    { name: "LIVE NETWORKING", icon: <Video size={16} /> },
    { name: "CALENDAR", icon: <Calendar size={16} /> },
    { name: "NEURAL VIEW", icon: <Network size={16} /> },
    { name: "ALL CONTACTS", icon: <ContactIcon size={16} /> },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMobileMenu} />}


      {/* Main Content */}
      <div className="bg-darkBlue flex-1 flex flex-col">

        {/* Tabs - Only show on desktop */}
        {!isMobile && pathname === "/" && (
          <div className="flex border-b border-darkerBlue overflow-x-auto p-2 pt-0 bg-[#1a2a50]">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                  activeTab === tab.name ? "bg-primary text-white" : "bg-transparent text-gray-300"
                } border-none rounded-t-lg cursor-pointer whitespace-nowrap relative transition-all duration-200 mr-1 ${
                  activeTab === tab.name ? "translate-y-[1px]" : "translate-y-0"
                }`}
                onMouseEnter={() => {
                  if (activeTab !== tab.name) {
                    setHoveredItem(`tab-${tab.name}`)
                  }
                }}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {activeTab === tab.name && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary-light rounded-t"></div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Tab Indicator */}
        {isMobile && pathname === "/" && (
          <div className="p-3 px-4 border-b border-darkerBlue flex items-center justify-between bg-[#1a2a50]">
            <div className="flex items-center gap-2 text-white font-medium">
              {tabs.find((tab) => tab.name === activeTab)?.icon}
              <span>{activeTab}</span>
            </div>
            <button
              className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center"
              onClick={toggleMobileMenu}
            >
              <Menu size={16} />
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            {/* Only render dashboard content on the main page */}
            {(() => {
              switch (activeTab) {
                case "MAP VIEW":
                  return <MapView />
                case "BOX VIEW":
                  return <BoxView />
                case "GENIE CHAT":
                  return <GenieChat />
                case "CONNECTION MIRROR":
                  return <ConnectionMirror />
                case "LIVE NETWORKING":
                  return <LiveNetworking />
                case "CALENDAR":
                  return <CalendarView />
                case "NEURAL VIEW":
                  return <NeuralView />
                case "ALL CONTACTS":
                  return <AllContacts />
                default:
                  return <MapView />
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
