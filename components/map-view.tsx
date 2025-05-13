"use client"

import { useState } from "react"
import { Search, MapPin, Compass, Layers, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import CustomNetworkMap from "./custom-network-map"

// Define network connection points with real coordinates
const connections = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechGrowth Inc.",
    location: "New York",
    coordinates: [40.7128, -74.006],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "CodeWorks",
    location: "San Francisco",
    coordinates: [37.7749, -122.4194],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Product Manager",
    company: "InnovateTech",
    location: "Chicago",
    coordinates: [41.8781, -87.6298],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Sales Director",
    company: "GrowthPartners",
    location: "Toronto",
    coordinates: [43.6532, -79.3832],
    type: "first",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Emily Thompson",
    role: "UX Designer",
    company: "DesignHub",
    location: "Miami",
    coordinates: [25.7617, -80.1918],
    type: "self",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "CTO",
    company: "TechInnovate",
    location: "Seattle",
    coordinates: [47.6062, -122.3321],
    type: "second",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 7,
    name: "Lisa Garcia",
    role: "Marketing Manager",
    company: "BrandBoost",
    location: "Los Angeles",
    coordinates: [34.0522, -118.2437],
    type: "second",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 8,
    name: "James Wilson",
    role: "Financial Analyst",
    company: "CapitalGrowth",
    location: "Boston",
    coordinates: [42.3601, -71.0589],
    type: "second",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 9,
    name: "Patricia Moore",
    role: "HR Director",
    location: "Austin",
    company: "TalentForce",
    coordinates: [30.2672, -97.7431],
    type: "third",
    avatar: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 10,
    name: "Thomas Anderson",
    role: "Data Scientist",
    company: "DataInsights",
    location: "Denver",
    coordinates: [39.7392, -104.9903],
    type: "third",
    avatar: "/placeholder.svg?height=50&width=50",
  },
]

// Define connection lines (relationships between people)
const connectionLines = [
  [1, 5], // Sarah - Emily
  [2, 5], // Michael - Emily
  [3, 5], // Jessica - Emily
  [4, 5], // David - Emily
  [6, 2], // Robert - Michael
  [7, 1], // Lisa - Sarah
  [8, 4], // James - David
  [9, 7], // Patricia - Lisa
  [10, 6], // Thomas - Robert
]

export default function MapView() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]) // Center of US
  const [zoom, setZoom] = useState(4)
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mapType, setMapType] = useState<"standard" | "satellite" | "dark">("standard")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [showConnectionLines, setShowConnectionLines] = useState(true)
  const [newMarker, setNewMarker] = useState<{ position: [number, number]; name: string } | null>(null)
  const [isAddingMarker, setIsAddingMarker] = useState(false)
  const [newMarkerName, setNewMarkerName] = useState("")
  const isMobile = useIsMobile()

  // Find self connection (you)
  const selfConnection = connections.find((conn) => conn.type === "self")
  const selfCoordinates = selfConnection ? selfConnection.coordinates : mapCenter

  // Handle map click for adding new markers
  const handleMapClick = (lat: number, lng: number) => {
    if (isAddingMarker) {
      setNewMarker({
        position: [lat, lng],
        name: "",
      })
    }
  }

  // Handle connection selection
  const handleConnectionSelect = (id: number) => {
    setSelectedConnection(id === selectedConnection ? null : id)
    const connection = connections.find((conn) => conn.id === id)
    if (connection) {
      setMapCenter(connection.coordinates as [number, number])
      setZoom(8)
    }
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      // Using Nominatim for geocoding (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()
      setSearchResults(data)
      setShowSearchResults(true)

      // If results found, center map on first result
      if (data.length > 0) {
        const firstResult = data[0]
        setMapCenter([Number.parseFloat(firstResult.lat), Number.parseFloat(firstResult.lon)])
        setZoom(12)
      }
    } catch (error) {
      console.error("Error searching for location:", error)
    }
  }

  // Handle search result selection
  const handleSearchResultSelect = (result: any) => {
    setMapCenter([Number.parseFloat(result.lat), Number.parseFloat(result.lon)])
    setZoom(13)
    setShowSearchResults(false)
    setSearchQuery(result.display_name.split(",")[0]) // Set search input to selected place name
  }

  // Get user's location
  const getUserLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setMapCenter([latitude, longitude])
          setZoom(13)
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsLocating(false)
    }
  }

  // Toggle map type
  const toggleMapType = () => {
    if (mapType === "standard") setMapType("satellite")
    else if (mapType === "satellite") setMapType("dark")
    else setMapType("standard")
  }

  // Save new marker
  const saveNewMarker = () => {
    if (newMarker && newMarkerName.trim()) {
      // In a real app, you would save this to your database
      console.log("New marker saved:", { ...newMarker, name: newMarkerName })
      setNewMarker(null)
      setNewMarkerName("")
      setIsAddingMarker(false)
    }
  }

  // Cancel adding new marker
  const cancelNewMarker = () => {
    setNewMarker(null)
    setNewMarkerName("")
    setIsAddingMarker(false)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 2))
  }

  // Get connection type color
  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case "self":
        return "bg-red-500"
      case "first":
        return "bg-primary"
      case "second":
        return "bg-emerald-500"
      case "third":
        return "bg-amber-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="relative h-full w-full bg-darkBlue">
      {/* Search and Controls Overlay */}
      <div
        className={`absolute z-10 flex flex-col gap-2.5 ${
          isMobile ? "left-2.5 right-2.5 top-2.5" : "left-5 top-5 w-[300px]"
        }`}
      >
        {/* Search Bar */}
        <div className="flex rounded-lg bg-darkerBlue/90 p-2 shadow-md">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
            className="flex-1 bg-transparent text-sm text-white outline-none"
          />
          <button onClick={handleSearch} className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <Search size={16} className="text-white" />
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div
            className={`max-h-[200px] overflow-y-auto rounded-lg bg-darkerBlue/95 p-2 shadow-md ${
              isMobile ? "w-full" : "w-[300px]"
            }`}
          >
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSearchResultSelect(result)}
                className={`flex cursor-pointer items-center p-2 text-sm text-white ${
                  index < searchResults.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <MapPin size={14} className="mr-2 flex-shrink-0" />
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">{result.display_name}</div>
              </div>
            ))}
          </div>
        )}

        {/* Connection List on Mobile */}
        {isMobile && selectedConnection === null && (
          <div className="mt-2.5 max-h-[200px] overflow-y-auto rounded-lg bg-darkerBlue/95 p-3 shadow-md">
            <div className="mb-2 text-sm font-bold text-white">Your Network ({connections.length})</div>
            <div className="flex flex-col gap-2">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  onClick={() => handleConnectionSelect(connection.id)}
                  className="flex cursor-pointer items-center rounded bg-white/10 p-2"
                >
                  <div
                    className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${getConnectionTypeColor(
                      connection.type,
                    )}`}
                  >
                    {connection.name.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-white">
                      {connection.name}
                    </div>
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400">
                      {connection.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className={`absolute z-10 flex flex-col gap-2.5 ${isMobile ? "right-2.5 top-2.5" : "right-5 top-5"}`}>
        {/* Map Type Toggle */}
        <button
          onClick={toggleMapType}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-darkerBlue/90 shadow-md"
          title="Change Map Type"
        >
          <Layers size={20} className="text-white" />
        </button>

        {/* Get User Location */}
        <button
          onClick={getUserLocation}
          disabled={isLocating}
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-darkerBlue/90 shadow-md ${
            isLocating ? "opacity-70" : ""
          }`}
          title="Find My Location"
        >
          <Compass size={20} className={`text-white ${isLocating ? "animate-spin" : ""}`} />
        </button>

        {/* Toggle Connection Lines */}
        <button
          onClick={() => setShowConnectionLines(!showConnectionLines)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-md ${
            showConnectionLines ? "bg-primary" : "bg-darkerBlue/90"
          }`}
          title={showConnectionLines ? "Hide Connection Lines" : "Show Connection Lines"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="5" cy="5" r="3" />
            <circle cx="19" cy="19" r="3" />
            <line x1="8" y1="8" x2="16" y2="16" />
          </svg>
        </button>

        {/* Add New Connection */}
        <button
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-md ${
            isAddingMarker ? "bg-red-500" : "bg-darkerBlue/90"
          }`}
          title={isAddingMarker ? "Cancel Adding" : "Add New Connection"}
        >
          <MapPin size={20} className="text-white" />
        </button>

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-darkerBlue/90 shadow-md"
          title="Zoom In"
        >
          <Plus size={20} className="text-white" />
        </button>

        <button
          onClick={handleZoomOut}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-darkerBlue/90 shadow-md"
          title="Zoom Out"
        >
          <Minus size={20} className="text-white" />
        </button>
      </div>

      {/* Connection Details Panel */}
      {selectedConnection && (
        <div
          className={`absolute z-10 rounded-lg bg-darkerBlue/95 p-4 shadow-md ${
            isMobile ? "bottom-5 left-2.5 w-[calc(100%-20px)]" : "bottom-7.5 left-5 w-[350px] max-w-[350px]"
          }`}
        >
          {(() => {
            const connection = connections.find((c) => c.id === selectedConnection)
            if (!connection) return null

            return (
              <>
                <div className="mb-3 flex items-center">
                  <div className="mr-3 h-[50px] w-[50px] overflow-hidden rounded-full">
                    <Image
                      src={connection.avatar || "/placeholder.svg"}
                      alt={connection.name}
                      width={50}
                      height={50}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-bold text-white">{connection.name}</h3>
                    <p className="text-sm text-gray-400">
                      {connection.role} at {connection.company}
                    </p>
                  </div>
                  <button onClick={() => setSelectedConnection(null)} className="ml-auto p-1 text-xl text-white">
                    ×
                  </button>
                </div>

                <div className="mb-3">
                  <div className="mb-2 flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm text-white">{connection.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`mr-2 inline-block h-3 w-3 rounded-full ${getConnectionTypeColor(connection.type)}`}
                    ></span>
                    <span className="text-sm text-white">
                      {connection.type === "self"
                        ? "You"
                        : connection.type === "first"
                          ? "1st Degree Connection"
                          : connection.type === "second"
                            ? "2nd Degree Connection"
                            : "3rd Degree Connection"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center rounded bg-primary py-2 text-sm text-white">
                    Connect
                  </button>
                  <button className="flex flex-1 items-center justify-center rounded bg-white/10 py-2 text-sm text-white">
                    View Profile
                  </button>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* New Marker Form */}
      {newMarker && (
        <div
          className={`absolute z-10 rounded-lg bg-darkerBlue/95 p-4 shadow-md ${
            isMobile ? "bottom-5 right-2.5 w-[calc(100%-20px)]" : "bottom-7.5 right-5 w-[300px]"
          }`}
        >
          <h3 className="mb-3 text-base font-bold text-white">Add New Connection</h3>
          <input
            type="text"
            placeholder="Connection name"
            value={newMarkerName}
            onChange={(e) => setNewMarkerName(e.target.value)}
            className="mb-3 w-full rounded bg-white/10 p-2 text-white outline-none"
          />
          <div className="flex gap-2">
            <button onClick={saveNewMarker} className="flex-1 rounded bg-primary py-2 text-sm text-white">
              Save
            </button>
            <button onClick={cancelNewMarker} className="flex-1 rounded bg-white/10 py-2 text-sm text-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        className={`absolute rounded-lg bg-darkerBlue/90 p-3 shadow-md ${
          isMobile ? `bottom-5 right-2.5 ${selectedConnection || newMarker ? "hidden" : "block"}` : "bottom-7.5 right-5"
        }`}
      >
        <div className="mb-2 text-sm font-bold text-white">Connection Types</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-white">You</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 inline-block h-3 w-3 rounded-full bg-primary"></span>
            <span className="text-xs text-white">1st Degree</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 inline-block h-3 w-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-white">2nd Degree</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 inline-block h-3 w-3 rounded-full bg-amber-500"></span>
            <span className="text-xs text-white">3rd Degree</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full w-full">
        <CustomNetworkMap
          center={mapCenter}
          zoom={zoom}
          mapType={mapType}
          connections={connections}
          connectionLines={connectionLines}
          showConnectionLines={showConnectionLines}
          selectedConnection={selectedConnection}
          userLocation={userLocation}
          newMarker={newMarker}
          onMapClick={handleMapClick}
          onMarkerClick={handleConnectionSelect}
        />
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
