// components/settings/SettingsSidebar.tsx
import React from "react";
import { User, Bell, Lock, Globe, Shield, Plug } from "lucide-react";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  const tabs = [
    { id: "profile", label: "General & Profile", icon: User },
    { id: "security", label: "Change Password", icon: Lock },
    { id: "twofactor", label: "Two-Factor Auth", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Plug },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <div className="w-full lg:w-56 bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${isActive
                  ? "bg-[#0F2D63] text-white"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsSidebar;