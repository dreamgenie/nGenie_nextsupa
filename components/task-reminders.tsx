"use client"

import { useState } from "react"
import { Search, Plus, Calendar, Check, X, MoreHorizontal, Filter } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// Sample task data
const initialTasks = [
  {
    id: 1,
    title: "Follow up with Sarah Johnson",
    description: "Discuss marketing collaboration opportunity",
    dueDate: "2025-05-20",
    priority: "high",
    completed: false,
    contact: {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechGrowth Inc.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Send proposal to Michael Chen",
    description: "Software integration project proposal",
    dueDate: "2025-05-18",
    priority: "medium",
    completed: false,
    contact: {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "CodeWorks",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "Schedule meeting with Jessica Williams",
    description: "Product demo and feature discussion",
    dueDate: "2025-05-25",
    priority: "low",
    completed: false,
    contact: {
      name: "Jessica Williams",
      role: "Product Manager",
      company: "InnovateTech",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Review contract with David Rodriguez",
    description: "Sales partnership agreement",
    dueDate: "2025-05-15",
    priority: "high",
    completed: true,
    contact: {
      name: "David Rodriguez",
      role: "Sales Director",
      company: "GrowthPartners",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    title: "Provide feedback on design mockups",
    description: "UI/UX design for new dashboard",
    dueDate: "2025-05-19",
    priority: "medium",
    completed: false,
    contact: {
      name: "Emily Thompson",
      role: "UX Designer",
      company: "DesignHub",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function TaskReminders() {
  const [tasks, setTasks] = useState(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate")
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  })
  const isMobile = useIsMobile()

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Filter by search query
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.contact.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by completion status
      const matchesFilter =
        filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else {
        // Sort by priority (high > medium > low)
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        )
      }
    })

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  // Delete task
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  // Add new task
  const handleAddTask = () => {
    if (newTask.title.trim() === "" || newTask.dueDate === "") return

    const newTaskObj = {
      id: Math.max(...tasks.map((task) => task.id)) + 1,
      ...newTask,
      completed: false,
      contact: {
        name: "Adam Smith",
        role: "Account Manager",
        company: "Your Company",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    }

    setTasks([...tasks, newTaskObj])
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    })
    setShowAddTask(false)
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-emerald-500"
      default:
        return "bg-gray-400"
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Check if task is overdue
  const isOverdue = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    return dueDate < today && !isToday(dateString)
  }

  // Check if task is due today
  const isToday = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  }

  return (
    <div className="flex h-full w-full flex-col bg-darkBlue">
      {/* Header */}
      <div className="flex flex-col border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl font-bold text-white md:text-2xl">Task Reminders</h1>
          <p className="text-sm text-gray-400">Keep track of your networking follow-ups</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex items-center rounded-lg bg-darkerBlue p-2">
            <Search className="mr-2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white outline-none"
            />
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center justify-center rounded-lg bg-primary p-2 text-white"
          >
            <Plus className="mr-2 h-5 w-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4">
        <div className="mr-4 flex items-center">
          <span className="mr-2 text-sm text-gray-400">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "completed")}
            className="rounded bg-darkerBlue px-2 py-1 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority")}
            className="rounded bg-darkerBlue px-2 py-1 text-sm text-white"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className="ml-auto flex items-center">
          <button className="flex items-center rounded bg-darkerBlue px-3 py-1 text-sm text-white">
            <Filter className="mr-1 h-4 w-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredTasks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-darkerBlue p-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">No tasks found</h3>
            <p className="text-gray-400">
              {searchQuery ? "Try adjusting your search or filters" : "Add a new task to get started"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-lg border ${
                  task.completed ? "border-gray-700 bg-darkerBlue/50" : "border-darkerBlue bg-darkerBlue"
                } p-4 shadow-md transition-all hover:shadow-lg`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border ${
                        task.completed ? "border-primary bg-primary text-white" : "border-gray-500 bg-transparent"
                      }`}
                    >
                      {task.completed && <Check className="h-4 w-4" />}
                    </button>
                    <h3
                      className={`text-lg font-semibold ${
                        task.completed ? "text-gray-400 line-through" : "text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className={`mb-3 text-sm ${task.completed ? "text-gray-500" : "text-gray-300"}`}>
                  {task.description}
                </p>

                <div className="mb-3 flex items-center">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                    <span
                      className={`text-xs ${
                        isOverdue(task.dueDate) && !task.completed
                          ? "text-red-400"
                          : isToday(task.dueDate) && !task.completed
                            ? "text-amber-400"
                            : "text-gray-400"
                      }`}
                    >
                      {isOverdue(task.dueDate) && !task.completed
                        ? "Overdue: "
                        : isToday(task.dueDate) && !task.completed
                          ? "Today: "
                          : ""}
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <div
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs text-white ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </div>
                </div>

                <div className="flex items-center border-t border-white/10 pt-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full">
                    <img
                      src={task.contact.avatar || "/placeholder.svg"}
                      alt={task.contact.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-white">{task.contact.name}</p>
                    <p className="text-xs text-gray-400">
                      {task.contact.role} at {task.contact.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-darkerBlue p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-white">Add New Task</h2>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-gray-400">Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full rounded bg-darkBlue p-2 text-white outline-none"
                placeholder="Task title"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-gray-400">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full rounded bg-darkBlue p-2 text-white outline-none"
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm text-gray-400">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full rounded bg-darkBlue p-2 text-white outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="mb-1 block text-sm text-gray-400">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full rounded bg-darkBlue p-2 text-white outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddTask(false)}
                className="rounded bg-white/10 px-4 py-2 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button onClick={handleAddTask} className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/80">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
