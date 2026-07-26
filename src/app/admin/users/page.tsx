"use client";
import { Users, Shield, Crown } from "lucide-react";

const DEMO_USERS = [
  { id: "u1", name: "Tony Stark", email: "tony@starkindustries.com", role: "admin", joined: "Jul 2026", orders: 12 },
  { id: "u2", name: "Steve Rogers", email: "steve@avengers.org", role: "vip", joined: "Jul 2026", orders: 5 },
  { id: "u3", name: "Peter Parker", email: "peter@dailybugle.com", role: "user", joined: "Jul 2026", orders: 2 },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-marvel-white tracking-wide">USER DIRECTORY</h2>
        <p className="font-sans text-xs text-marvel-white-muted">Customer accounts, VIP status assignments, access roles</p>
      </div>

      <div className="bg-marvel-black-card border border-marvel-black-border overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-marvel-black-soft border-b border-marvel-black-border text-marvel-white-muted uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Total Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-marvel-black-border text-marvel-white-dim">
            {DEMO_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-marvel-black-hover transition-colors">
                <td className="p-4 font-semibold text-marvel-white">{u.name}</td>
                <td className="p-4 font-mono text-marvel-white-muted">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                    u.role === "admin" ? "bg-marvel-red text-white" : u.role === "vip" ? "bg-marvel-gold text-marvel-black" : "bg-marvel-black-border text-marvel-white-muted"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-marvel-white-muted">{u.joined}</td>
                <td className="p-4 font-mono">{u.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
