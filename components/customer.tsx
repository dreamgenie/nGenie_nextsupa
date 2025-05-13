"use client"

import { useState } from "react"
import { Search, Filter, Plus, ChevronDown, ChevronUp, MoreHorizontal, Phone, Mail, MapPin, Star } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

// Sample customer data
const customers = [
  {
    id: 1,
    name: "TechGrowth Inc.",
    industry: "Technology",
    location: "New York, NY",
    status: "Active",
    revenue: "$1.2M",
    contacts: [
      {
        id: 101,
        name: "Sarah Johnson",
        role: "Marketing Director",
        email: "sarah.johnson@techgrowth.com",
        phone: "+1 (555) 123-4567",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      {
        id: 102,
        name: "John Smith",
        role: "CEO",
        email: "john.smith@techgrowth.com",
        phone: "+1 (555) 987-6543",
        avatar: "/placeholder.svg?height=50&width=50",
      },
    ],
    lastContact: "2025-05-10",
    notes: "Interested in expanding their marketing services. Follow up about new platform features.",
    rating: 5,
  },
  {
    id: 2,
    name: "InnovateTech",
    industry: "Software",
    location: "San Francisco, CA",
    status: "Active",
    revenue: "$3.7M",
    contacts: [
      {
        id: 201,
        name: "Jessica Williams",
        role: "Product Manager",
        email: "jessica.williams@innovatetech.com",
        phone: "+1 (555) 345-6789",
        avatar: "/placeholder.svg?height=50&width=50",
      },
    ],
    lastContact: "2025-05-05",
    notes: "Currently using our premium plan. Looking to integrate with their CRM system.",
    rating: 4,
  },
  {
    id: 3,
    name: "GrowthPartners",
    industry: "Consulting",
    location: "Chicago, IL",
    status: "Inactive",
    revenue: "$850K",
    contacts: [
      {
        id: 301,
        name: "David Rodriguez",
        role: "Sales Director",
        email: "david.rodriguez@growthpartners.com",
        phone: "+1 (555) 456-7890",
        avatar: "/placeholder.svg?height=50&width=50",
      },
    ],
    lastContact: "2025-04-15",
    notes: "Contract renewal coming up in July. Need to schedule a review meeting.",
    rating: 3,
  },
  {
    id: 4,
    name: "DesignHub",
    industry: "Creative",
    location: "Austin, TX",
    status: "Active",
    revenue: "$1.5M",
    contacts: [
      {
        id: 401,
        name: "Emily Thompson",
        role: "UX Designer",
        email: "emily.thompson@designhub.com",
        phone: "+1 (555) 567-8901",
        avatar: "/placeholder.svg?height=50&width=50",
      },
    ],
    lastContact: "2025-05-12",
    notes: "Recently upgraded to enterprise plan. Very satisfied with the service.",
    rating: 5,
  },
  {
    id: 5,
    name: "DataInsights",
    industry: "Analytics",
    location: "Boston, MA",
    status: "Prospect",
    revenue: "$2.3M",
    contacts: [
      {
        id: 501,
        name: "Thomas Anderson",
        role: "Data Scientist",
        email: "thomas.anderson@datainsights.com",
        phone: "+1 (555) 678-9012",
        avatar: "/placeholder.svg?height=50&width=50",
      },
    ],
    lastContact: "2025-05-01",
    notes: "Interested in our data visualization features. Send demo next week.",
    rating: 4,
  },
]

export default function Customer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null)
  const [expandedCustomers, setExpandedCustomers] = useState<number[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const isMobile = useIsMobile()

  // Filter customers based on search and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contacts.some((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Toggle customer expansion
  const toggleExpand = (customerId: number) => {
    if (expandedCustomers.includes(customerId)) {
      setExpandedCustomers(expandedCustomers.filter((id) => id !== customerId))
    } else {
      setExpandedCustomers([...expandedCustomers, customerId])
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500"
      case "inactive":
        return "bg-gray-500"
      case "prospect":
        return "bg-amber-500"
      default:
        return "bg-blue-500"
    }
  }

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-400"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col bg-darkBlue">
      {/* Header */}
      <div className="flex flex-col border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-white md:text-2xl">Customers</h1>
          <p className="text-sm text-gray-400">Manage your customer relationships</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex items-center rounded-lg bg-darkerBlue p-2">
            <Search className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white outline-none"
            />
          </div>
          <button className="flex items-center justify-center rounded-lg bg-primary p-2 text-white">
            <Plus className="mr-2 h-5 w-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4">
        <div className="mr-4 flex items-center">
          <span className="mr-2 text-sm text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded bg-darkerBlue px-2 py-1 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
        <div className="ml-auto flex items-center">
          <button className="flex items-center rounded bg-darkerBlue px-3 py-1 text-sm text-white">
            <Filter className="mr-1 h-4 w-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCustomers.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-darkerBlue p-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">No customers found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
              const isExpanded = expandedCustomers.includes(customer.id)
              const isSelected = selectedCustomer === customer.id

              return (
                <div
                  key={customer.id}
                  className={`overflow-hidden rounded-lg border ${
                    isSelected ? "border-primary" : "border-darkerBlue"
                  } bg-darkerBlue shadow-md transition-all`}
                >
                  {/* Customer Header */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-4"
                    onClick={() => toggleExpand(customer.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                        <p className="text-sm text-gray-400">{customer.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`mr-4 rounded-full px-2 py-0.5 text-xs text-white ${getStatusColor(
                          customer.status,
                        )}`}
                      >
                        {customer.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-gray-400">Company Details</h4>
                          <div className="space-y-2 rounded-lg bg-darkBlue p-3">
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-white">{customer.location}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm text-gray-400">Revenue:</span>
                              <span className="text-sm text-white">{customer.revenue}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm text-gray-400">Last Contact:</span>
                              <span className="text-sm text-white">{formatDate(customer.lastContact)}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm text-gray-400">Rating:</span>
                              {renderRating(customer.rating)}
                            </div>
                          </div>

                          <h4 className="mb-2 mt-4 text-sm font-semibold text-gray-400">Notes</h4>
                          <div className="rounded-lg bg-darkBlue p-3">
                            <p className="text-sm text-white">{customer.notes}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2 text-sm font-semibold text-gray-400">
                            Contacts ({customer.contacts.length})
                          </h4>
                          <div className="space-y-3">
                            {customer.contacts.map((contact) => (
                              <div key={contact.id} className="flex items-start rounded-lg bg-darkBlue p-3">
                                <div className="h-10 w-10 overflow-hidden rounded-full">
                                  <Image
                                    src={contact.avatar || "/placeholder.svg"}
                                    alt={contact.name}
                                    width={50}
                                    height={50}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-white">{contact.name}</h5>
                                    <button className="text-gray-400 hover:text-white">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-400">{contact.role}</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <a
                                      href={`mailto:${contact.email}`}
                                      className="flex items-center rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                                    >
                                      <Mail className="mr-1 h-3 w-3" />
                                      {contact.email}
                                    </a>
                                    <a
                                      href={`tel:${contact.phone}`}
                                      className="flex items-center rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                                    >
                                      <Phone className="mr-1 h-3 w-3" />
                                      {contact.phone}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <button className="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">
                          Edit
                        </button>
                        <button className="rounded bg-primary px-3 py-1 text-sm text-white hover:bg-primary/80">
                          Contact
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
