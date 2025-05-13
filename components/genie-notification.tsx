"use client"

import { useState } from "react"
import { Bell, Settings, X, ChevronRight, Calendar, Users, MapPin, Sparkles } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

// Sample notification data
const initialNotifications = [
  {
    id: 1,
    type: "connection",
    title: "New Connection Request",
    message: "Sarah Johnson has sent you a connection request",
    time: "10 minutes ago",
    read: false,
    action: "accept",
    user: {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechGrowth Inc.",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  },
  {
    id: 2,
    type: "reminder",
    title: "Meeting Reminder",
    message: "Upcoming meeting with Michael Chen in 30 minutes",
    time: "30 minutes ago",
    read: false,
    action: "view",
    user: {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "CodeWorks",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    meetingTime: "2:30 PM",
  },
  {
    id: 3,
    type: "insight",
    title: "Network Insight",
    message: "Your connection Jessica Williams just changed roles to Product Manager",
    time: "2 hours ago",
    read: true,
    action: "view",
    user: {
      name: "Jessica Williams",
      role: "Product Manager",
      company: "InnovateTech",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  },
  {
    id: 4,
    type: "recommendation",
    title: "Connection Recommendation",
    message: "Based on your network, you might know David Rodriguez",
    time: "5 hours ago",
    read: true,
    action: "connect",
    user: {
      name: "David Rodriguez",
      role: "Sales Director",
      company: "GrowthPartners",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    mutualConnections: 3,
  },
  {
    id: 5,
    type: "event",
    title: "Networking Event",
    message: "Tech Industry Meetup happening near you next week",
    time: "1 day ago",
    read: true,
    action: "rsvp",
    eventDate: "May 25, 2025",
    eventLocation: "San Francisco Convention Center",
    attendees: 45,
  },
]

export default function GenieNotification() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null)
  const isMobile = useIsMobile()

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Handle notification action
  const handleAction = (notification: any) => {
    // In a real app, this would perform the actual action
    console.log(`Performing action: ${notification.action} for notification ID: ${notification.id}`)
    markAsRead(notification.id)
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "connection":
        return <Users className="h-5 w-5 text-primary" />
      case "reminder":
        return <Calendar className="h-5 w-5 text-amber-500" />
      case "insight":
        return <Sparkles className="h-5 w-5 text-emerald-500" />
      case "recommendation":
        return <Users className="h-5 w-5 text-blue-500" />
      case "event":
        return <MapPin className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  // Get action button text and color
  const getActionButton = (action: string) => {
    switch (action) {
      case "accept":
        return {
          text: "Accept",
          color: "bg-primary hover:bg-primary/80",
        }
      case "connect":
        return {
          text: "Connect",
          color: "bg-primary hover:bg-primary/80",
        }
      case "view":
        return {
          text: "View",
          color: "bg-blue-500 hover:bg-blue-600",
        }
      case "rsvp":
        return {
          text: "RSVP",
          color: "bg-emerald-500 hover:bg-emerald-600",
        }
      default:
        return {
          text: "View",
          color: "bg-gray-500 hover:bg-gray-600",
        }
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-darkBlue">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <h1 className="text-xl font-bold text-white md:text-2xl">Genie Notifications</h1>
          <p className="text-sm text-gray-400">Stay updated with your network</p>
        </div>
        <button className="rounded-full bg-darkerBlue p-2 text-white hover:bg-white/10">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm ${filter === "all" ? "font-semibold text-primary" : "text-gray-400 hover:text-white"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`text-sm ${
              filter === "unread" ? "font-semibold text-primary" : "text-gray-400 hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`text-sm ${filter === "read" ? "font-semibold text-primary" : "text-gray-400 hover:text-white"}`}
          >
            Read
          </button>
        </div>
        <button onClick={markAllAsRead} className="text-sm text-primary hover:text-primary/80">
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-1 overflow-hidden">
        {/* Notifications List */}
        <div className={`flex-1 overflow-y-auto ${isMobile && selectedNotification ? "hidden" : "block"}`}>
          {filteredNotifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-4">
              <div className="mb-4 rounded-full bg-darkerBlue p-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">No notifications</h3>
              <p className="text-gray-400">
                {filter === "unread"
                  ? "You have no unread notifications"
                  : filter === "read"
                    ? "You have no read notifications"
                    : "You have no notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex cursor-pointer items-start p-4 hover:bg-darkerBlue ${
                    !notification.read ? "bg-darkerBlue/50" : ""
                  }`}
                  onClick={() => {
                    setSelectedNotification(notification.id)
                    markAsRead(notification.id)
                  }}
                >
                  <div className="mr-3 rounded-full bg-darkBlue p-2">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-white">{notification.title}</h3>
                      <div className="flex items-center">
                        {!notification.read && <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>}
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-300">{notification.message}</p>
                    {notification.user && (
                      <div className="mt-2 flex items-center">
                        <div className="h-6 w-6 overflow-hidden rounded-full">
                          <Image
                            src={notification.user.avatar || "/placeholder.svg"}
                            alt={notification.user.name}
                            width={24}
                            height={24}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="ml-2 text-xs text-gray-400">
                          {notification.user.name} · {notification.user.role}
                        </span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        {notification.type === "recommendation" && (
                          <span className="text-xs text-gray-400">
                            {notification.mutualConnections} mutual connections
                          </span>
                        )}
                        {notification.type === "event" && (
                          <span className="text-xs text-gray-400">
                            {notification.eventDate} · {notification.attendees} attendees
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Detail */}
        {selectedNotification && (
          <div
            className={`border-l border-white/10 bg-darkerBlue ${
              isMobile ? "absolute inset-0 z-10" : "w-1/3 min-w-[350px]"
            }`}
          >
            {(() => {
              const notification = notifications.find((n) => n.id === selectedNotification)
              if (!notification) return null

              return (
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                    <div className="flex items-center">
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="mr-2 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      {isMobile && (
                        <button
                          onClick={() => setSelectedNotification(null)}
                          className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4 flex items-center">
                      <div className="rounded-full bg-darkBlue p-2">{getNotificationIcon(notification.type)}</div>
                      <span className="ml-2 text-sm text-gray-400">{notification.time}</span>
                    </div>

                    <p className="mb-4 text-white">{notification.message}</p>

                    {notification.user && (
                      <div className="mb-4 rounded-lg bg-darkBlue p-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 overflow-hidden rounded-full">
                            <Image
                              src={notification.user.avatar || "/placeholder.svg"}
                              alt={notification.user.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-semibold text-white">{notification.user.name}</h4>
                            <p className="text-sm text-gray-400">
                              {notification.user.role} at {notification.user.company}
                            </p>
                          </div>
                        </div>

                        {notification.type === "recommendation" && (
                          <div className="mt-3 flex items-center">
                            <Users className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {notification.mutualConnections} mutual connections
                            </span>
                          </div>
                        )}

                        {notification.type === "reminder" && notification.meetingTime && (
                          <div className="mt-3 flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Meeting at {notification.meetingTime}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {notification.type === "event" && (
                      <div className="mb-4 rounded-lg bg-darkBlue p-4">
                        <h4 className="mb-2 font-semibold text-white">Event Details</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-white">{notification.eventDate}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-white">{notification.eventLocation}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-white">{notification.attendees} attendees</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedNotification(null)}
                        className="rounded bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(notification)}
                        className={`rounded px-4 py-2 text-sm text-white ${getActionButton(notification.action).color}`}
                      >
                        {getActionButton(notification.action).text}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}
