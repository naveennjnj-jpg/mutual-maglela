// components/settings/SettingsLayout.tsx
import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import ProfileTab from "./ProfileTab";
import TwoFactorTab from "./TwoFactorTab";
import SecurityTab from "./SecurityTab";
import Integrations from "./Integrations";

interface SettingsLayoutProps {
  defaultTab?: string;
  title?: string;
  subtitle?: string;
}

const SettingsLayout = ({
  defaultTab = "profile",
  title = "Settings",
  subtitle = "Manage your account, preferences, and security",
}: SettingsLayoutProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "twofactor":
        return <TwoFactorTab />;
      case "security":
        return <SecurityTab />;
      case "integrations":
        return <Integrations />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-6">
      <div>
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
            Account
          </p>
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
            {title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col sm:flex-row gap-6">
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="flex-1 min-w-0 space-y-0">
            <div className="space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;