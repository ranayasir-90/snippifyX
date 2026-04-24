"use client";
import { useState, useEffect } from "react";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/layouts/AdminLayout";
import { adminSettingsService } from "@/lib/firebaseServices";
import type { AdminSettings } from "@/lib/firebaseServices";
import { FiSettings, FiCheck, FiX } from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";

const defaultSettings: AdminSettings = {
  siteName: "CopyGenie",
  enablePublicSnippets: true,
  enableUserRegistration: true,
  maintenanceMode: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showError } = useError();

  useEffect(() => {
    setLoading(true);
    adminSettingsService.get().then((data) => {
      if (data) setSettings(data);
      setLoading(false);
    }).catch(() => {
      setSettings(defaultSettings);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminSettingsService.update(settings);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      showError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLoading(true);
    adminSettingsService.get().then((data) => {
      if (data) setSettings(data);
      setLoading(false);
      setEditing(false);
    }).catch(() => {
      setSettings(defaultSettings);
      setLoading(false);
      setEditing(false);
    });
  };

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2"><FiSettings />Settings</h1>
        </div>
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 p-8">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading settings...</div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block font-medium mb-1">Site Name</label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white p-2"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
              <div className="mb-6 flex flex-col gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="enablePublicSnippets"
                    checked={settings.enablePublicSnippets}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  Enable Public Snippets
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="enableUserRegistration"
                    checked={settings.enableUserRegistration}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  Enable User Registration
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  Maintenance Mode
                </label>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold disabled:opacity-50"
                  onClick={handleSave}
                  disabled={!editing || saving}
                >
                  <FiCheck />Save
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-600 disabled:opacity-50"
                  onClick={handleCancel}
                  disabled={!editing || saving}
                >
                  <FiX />Cancel
                </button>
              </div>
              {saving && <div className="mt-4 text-blue-500">Saving...</div>}
              {success && <div className="mt-4 text-green-600">Settings saved!</div>}
            </>
          )}
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
} 