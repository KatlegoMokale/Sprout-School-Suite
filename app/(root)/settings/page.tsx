"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme, ThemeName } from "@/components/providers/theme-provider";
import { ALL_PERMISSIONS } from "@/lib/auth/permissions";

type AppUser = {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "manager" | "teacher" | "accountant";
  permissions: string[];
  isActive: boolean;
};

const roles: AppUser["role"][] = ["admin", "manager", "teacher", "accountant"];
const themes: ThemeName[] = ["light", "dark", "forest", "sunrise"];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "teacher" as AppUser["role"] });

  const loadUsers = async () => {
    const response = await fetch("/api/users");
    if (response.ok) {
      const data = await response.json();
      setUsers(data.users || []);
      setError("");
    } else if (response.status === 403) {
      setError("You do not have permission to manage users.");
    }
  };

  useEffect(() => {
    loadUsers().catch(() => setError("Could not load users"));
  }, []);

  const createUser = async () => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not create user");
      return;
    }

    setForm({ fullName: "", email: "", password: "", role: "teacher" });
    await loadUsers();
  };

  const updateUser = async (userId: string, updates: Partial<AppUser>) => {
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    await loadUsers();
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {themes.map((name) => (
              <Button key={name} variant={theme === name ? "default" : "outline"} onClick={() => setTheme(name)}>
                {name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Roles and Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div>
              <Label>Full Name</Label>
              <Input value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} type="email" onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <Label>Password</Label>
              <Input value={form.password} type="password" onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
            <div>
              <Label>Role</Label>
              <select className="w-full border rounded-md px-3 py-2" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as AppUser["role"] }))}>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <Button onClick={createUser}>Create User</Button>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border rounded-lg p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-md px-2 py-1"
                      value={user.role}
                      onChange={(e) => updateUser(user._id, { role: e.target.value as AppUser["role"] })}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <Button variant={user.isActive ? "outline" : "default"} onClick={() => updateUser(user._id, { isActive: !user.isActive })}>
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ALL_PERMISSIONS.map((permission) => {
                    const enabled = user.permissions.includes(permission);
                    return (
                      <Button
                        key={permission}
                        size="sm"
                        variant={enabled ? "default" : "outline"}
                        onClick={() => {
                          const nextPermissions = enabled
                            ? user.permissions.filter((item) => item !== permission)
                            : [...user.permissions, permission];
                          updateUser(user._id, { permissions: nextPermissions });
                        }}
                      >
                        {permission}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
