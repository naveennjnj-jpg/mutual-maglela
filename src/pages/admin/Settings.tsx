// pages/admin/Settings.tsx
import React from "react";
import SettingsLayout from "@/components/admin/settings/SettingsLayout";

const Settings = () => {
  return (
    <SettingsLayout
      defaultTab="profile"
      title="Settings"
      subtitle="Manage your account, preferences, and security"
    />
  );
};

export default Settings;