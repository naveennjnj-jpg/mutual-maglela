// pages/user/ManageAvailability.tsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Trash2,
  Plus,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityFormData {
  mode: "recurring" | "specific";
  selectedDays: string[];
  status: "available" | "blocked";
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  timeSlots: TimeSlot[];
  blockStartDate: string;
  blockEndDate: string;
  blockStartTime: string;
  blockEndTime: string;
  blockTimezone: string;
}

const ManageAvailability = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AvailabilityFormData>({
    mode: "recurring",
    selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "available",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    timezone: "Africa/Johannesburg",
    timeSlots: [
      { id: "1", startTime: "09:00", endTime: "17:00" },
    ],
    blockStartDate: "",
    blockEndDate: "",
    blockStartTime: "",
    blockEndTime: "",
    blockTimezone: "Africa/Johannesburg",
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timezones = [
    "Africa/Johannesburg",
    "Africa/Lagos",
    "Africa/Nairobi",
    "Africa/Cairo",
    "Europe/London",
    "America/New_York",
    "Asia/Dubai",
  ];

  // Fetch existing availability on mount
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/availability`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setFormData({
          mode: data.mode || "recurring",
          selectedDays: data.selectedDays || ["Mon", "Tue", "Wed", "Thu", "Fri"],
          status: data.status || "available",
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
          startTime: data.startTime || "09:00",
          endTime: data.endTime || "17:00",
          timezone: data.timezone || "Africa/Johannesburg",
          timeSlots: data.timeSlots || [{ id: "1", startTime: "09:00", endTime: "17:00" }],
          blockStartDate: data.blockStartDate ? new Date(data.blockStartDate).toISOString().split('T')[0] : "",
          blockEndDate: data.blockEndDate ? new Date(data.blockEndDate).toISOString().split('T')[0] : "",
          blockStartTime: data.blockStartTime || "",
          blockEndTime: data.blockEndTime || "",
          blockTimezone: data.blockTimezone || "Africa/Johannesburg",
        });
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelect = (mode: "recurring" | "specific") => {
    setFormData((prev) => ({
      ...prev,
      mode,
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDays.includes(day);
      const newSelectedDays = isSelected
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];
      return {
        ...prev,
        selectedDays: newSelectedDays,
      };
    });
  };

  const handleStatusSelect = (status: "available" | "blocked") => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeSlotChange = (
    id: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleAddTimeSlot = () => {
    const newId = String(Date.now());
    setFormData((prev) => ({
      ...prev,
      timeSlots: [
        ...prev.timeSlots,
        { id: newId, startTime: "09:00", endTime: "17:00" },
      ],
    }));
  };

  const handleRemoveTimeSlot = (id: string) => {
    if (formData.timeSlots.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((slot) => slot.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
        setSaving(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/admin/availability`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Availability settings saved successfully!");
        navigate("/admin/schedule");
      } else {
        toast.error(response.data.message || "Failed to save availability");
      }
    } catch (error: any) {
      console.error("Error saving availability:", error);
      toast.error(error.response?.data?.message || "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/schedule");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C85A32] mx-auto mb-4" />
          <p className="text-gray-500">Loading availability settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button
          onClick={handleCancel}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C85A32]">
            Schedule
          </p>
          <h1 className="text-base font-bold text-[#0F2D63] leading-tight">
            Manage Availability
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </button>
      </div>

      {/* Form Content */}
      <div className="max-w-[720px] mx-auto px-4 py-7 space-y-5">
        {/* Availability Mode */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
            Availability Mode
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeSelect("recurring")}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                formData.mode === "recurring"
                  ? "border-[#0F2D63] bg-[#EEF2FA]"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  formData.mode === "recurring"
                    ? "border-[#0F2D63] bg-[#0F2D63]"
                    : "border-gray-300"
                }`}
              >
                {formData.mode === "recurring" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-bold ${
                    formData.mode === "recurring"
                      ? "text-[#0F2D63]"
                      : "text-gray-700"
                  }`}
                >
                  Recurring Days
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Set availability for repeating weekly days
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleModeSelect("specific")}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                formData.mode === "specific"
                  ? "border-[#0F2D63] bg-[#EEF2FA]"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                  formData.mode === "specific"
                    ? "border-[#0F2D63] bg-[#0F2D63]"
                    : "border-gray-300"
                }`}
              >
                {formData.mode === "specific" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-bold ${
                    formData.mode === "specific"
                      ? "text-[#0F2D63]"
                      : "text-gray-700"
                  }`}
                >
                  Specific Dates
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Set availability for individual dates
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Recurring Days */}
        {formData.mode === "recurring" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
                Recurring Days
              </p>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const isSelected = formData.selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-12 h-10 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? "bg-[#0F2D63] text-white border-[#0F2D63]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Status
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleStatusSelect("available")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-all ${
                    formData.status === "available"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  available
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusSelect("blocked")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-all ${
                    formData.status === "blocked"
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  blocked
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date & Time Range */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
            Date & Time Range
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white cursor-pointer"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
            Time Slots
          </p>
          {formData.timeSlots.map((slot, index) => (
            <div key={slot.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 w-5 text-center">
                {index + 1}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    handleTimeSlotChange(slot.id, "startTime", e.target.value)
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#0F2D63] bg-white flex-1"
                />
                <span className="text-gray-400 text-sm">→</span>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    handleTimeSlotChange(slot.id, "endTime", e.target.value)
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#0F2D63] bg-white flex-1"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTimeSlot(slot.id)}
                disabled={formData.timeSlots.length <= 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs font-semibold text-gray-400 hover:border-[#0F2D63] hover:text-[#0F2D63] transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Time Slot
          </button>
        </div>

        {/* Block Dates */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            Block Dates
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Block Start Date
              </label>
              <input
                type="date"
                name="blockStartDate"
                value={formData.blockStartDate}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Block Start Time
              </label>
              <input
                type="time"
                name="blockStartTime"
                value={formData.blockStartTime}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Block End Date
              </label>
              <input
                type="date"
                name="blockEndDate"
                value={formData.blockEndDate}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                Block End Time
              </label>
              <input
                type="time"
                name="blockEndTime"
                value={formData.blockEndTime}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Timezone
            </label>
            <select
              name="blockTimezone"
              value={formData.blockTimezone}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-1 focus:ring-[#0F2D63]/10 transition-all bg-white cursor-pointer"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Availability"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailability;