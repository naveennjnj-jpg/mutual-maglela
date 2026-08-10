// pages/user/Schedule.tsx
import React, { useState } from "react";
import {
  Settings2,
  Plus,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  events?: CalendarEvent[];
}

interface CalendarEvent {
  id: string;
  title: string;
  time?: string;
  type: "workshop" | "meeting" | "deadline";
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "pending" | "completed";
}

interface InvoiceDue {
  id: string;
  client: string;
  amount: number;
  status: "today" | "overdue" | "upcoming";
}

const Schedule = () => {
  const [currentMonth, setCurrentMonth] = useState(7); // August (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);

  // Mock data for projects
  const projects: Project[] = [
    {
      id: "1",
      name: "Renewable Energy Policy Study",
      client: "Ronald Sithole",
      status: "active",
    },
    {
      id: "2",
      name: "AU Commission Grant Application",
      client: "Amara Nwosu",
      status: "active",
    },
  ];

  // Mock data for invoices due
  const invoicesDue: InvoiceDue[] = [
    {
      id: "1",
      client: "Thabo Nkosi",
      amount: 8200,
      status: "today",
    },
    {
      id: "2",
      client: "Dr. Sipho Dlamini",
      amount: 25000,
      status: "overdue",
    },
  ];

  const getStatusColor = (status: Project["status"]) => {
    const config = {
      active: "bg-green-500",
      pending: "bg-amber-500",
      completed: "bg-blue-500",
    };
    return config[status] || config.active;
  };

  const getInvoiceStatusColor = (status: InvoiceDue["status"]) => {
    const config = {
      today: "text-gray-400",
      overdue: "text-red-500",
      upcoming: "text-amber-500",
    };
    return config[status] || config.today;
  };

  const getInvoiceStatusLabel = (status: InvoiceDue["status"]) => {
    const config = {
      today: "Due Today",
      overdue: "Overdue",
      upcoming: "Upcoming",
    };
    return config[status] || config.today;
  };

  // Generate calendar days for the current month
  const generateCalendarDays = (): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const days: CalendarDay[] = [];

    // Add empty days for previous month
    for (let i = 0; i < startingDay; i++) {
      days.push({
        date: 0,
        isCurrentMonth: false,
      });
    }

    // Add days of current month
    const today = new Date();
    const isTodayMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: isTodayMonth && i === today.getDate(),
        events: [],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const changeMonth = (direction: number) => {
    const newMonth = currentMonth + direction;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FB] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Operations
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">My Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your calendar, events and availability
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/manage-availability"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#0F2D63] text-[#0F2D63] text-sm font-semibold rounded-xl hover:bg-[#0F2D63] hover:text-white transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Manage Availability
          </Link>
          <Link
            to="/admin/add-event"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </Link>
        </div>
      </div>

      {/* Calendar and Sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Calendar */}
        <div className="w-full lg:w-[70%]">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0F2D63]">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-xs font-semibold rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-2.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {calendarDays.map((day, index) => {
                const isEmpty = !day.isCurrentMonth;

                if (isEmpty) {
                  return (
                    <div key={`empty-${index}`} className="h-24 bg-[#fafafa]" />
                  );
                }

                const isToday = day.isToday;

                return (
                  <button
                    key={`day-${day.date}`}
                    className={`h-24 p-2 flex flex-col items-start text-left transition-all relative group ${
                      isToday ? "bg-[#0F2D63]" : "hover:bg-[#f4f6fb]"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold mb-1 flex-shrink-0 ${
                        isToday
                          ? "bg-white text-[#0F2D63]"
                          : "text-gray-700 group-hover:text-[#0F2D63]"
                      }`}
                    >
                      {day.date}
                    </span>
                    <div className="w-full space-y-0.5 overflow-hidden">
                      {/* Events would be rendered here */}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                No events on Monday, 10 August
              </p>
              <Link
                to="/dashboard/add-event"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#C85A32] hover:underline"
              >
                <Plus className="w-3 h-3" />
                Add event
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%] space-y-4">
          {/* Today Card */}
          <div className="bg-[#0F2D63] rounded-2xl p-5">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Today
            </p>
            <p className="text-xl font-bold text-white mt-1">Monday</p>
            <p className="text-sm text-white/60">10 August 2026</p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
              <span className="text-xs text-white/60">0 meetings today</span>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FolderKanban className="w-3 h-3 text-[#C85A32]" />
              Active Projects
            </p>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="flex items-start gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${getStatusColor(
                      project.status
                    )}`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0F2D63] leading-tight">
                      {project.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {project.client}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices Due */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[#C85A32]" />
              Invoices Due
            </p>
            <div className="space-y-3">
              {invoicesDue.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0F2D63] truncate">
                      {invoice.client}
                    </p>
                    <p
                      className={`text-[10px] mt-0.5 font-medium ${getInvoiceStatusColor(
                        invoice.status
                      )}`}
                    >
                      {getInvoiceStatusLabel(invoice.status)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#0F2D63] flex-shrink-0">
                    R {invoice.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Event Button */}
          <Link
            to="/dashboard/add-event"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Schedule;