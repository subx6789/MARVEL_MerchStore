"use client";
import { Settings, Save, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-3xl text-marvel-white tracking-wide">SYSTEM SETTINGS</h2>
        <p className="font-sans text-xs text-marvel-white-muted">Platform configurations, delivery rules, checkout toggles</p>
      </div>

      <div className="bg-marvel-black-card border border-marvel-black-border p-6 space-y-4">
        <h3 className="font-display text-xl text-marvel-white">DELIVERY CONFIGURATION</h3>
        <div>
          <label className="label-marvel block mb-2">Free Shipping Minimum Threshold (₹)</label>
          <input type="number" defaultValue={1999} className="input-marvel" />
        </div>
        <div>
          <label className="label-marvel block mb-2">Flat Shipping Fee (₹)</label>
          <input type="number" defaultValue={99} className="input-marvel" />
        </div>
        <button className="btn-marvel text-xs py-3 px-6">Save Settings</button>
      </div>
    </div>
  );
}
