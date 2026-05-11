"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileUser = {
  fullName: string;
  email: string;
  role: string;
  permissions: string[];
  profileImage?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  contact?: string;
  dateOfBirth?: string;
  idNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
};

const emptyForm: ProfileUser = {
  fullName: "",
  email: "",
  role: "",
  permissions: [],
  profileImage: "",
  jobTitle: "",
  department: "",
  bio: "",
  contact: "",
  dateOfBirth: "",
  idNumber: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileUser>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const initials = useMemo(() => {
    if (!form.fullName) return "U";
    const parts = form.fullName.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [form.fullName]);

  const loadProfile = async () => {
    const res = await fetch("/api/profile");
    if (!res.ok) throw new Error("Failed to load profile");
    const data = await res.json();
    setForm({ ...emptyForm, ...data.user });
  };

  useEffect(() => {
    loadProfile()
      .catch(() => setMessage("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 8_000_000) {
      setMessage("Image must be smaller than 8MB");
      return;
    }

    try {
      const processed = await processProfileImage(file);
      setForm((prev) => ({ ...prev, profileImage: processed }));
      setMessage("Image optimized successfully");
    } catch {
      setMessage("Could not process image");
    }
  };

  const processProfileImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const size = 320;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas context unavailable"));

          const srcW = image.width;
          const srcH = image.height;
          const srcSize = Math.min(srcW, srcH);
          const sx = (srcW - srcSize) / 2;
          const sy = (srcH - srcSize) / 2;

          ctx.drawImage(image, sx, sy, srcSize, srcSize, 0, 0, size, size);
          const output = canvas.toDataURL("image/jpeg", 0.82);
          resolve(output);
        };
        image.onerror = () => reject(new Error("Invalid image"));
        image.src = String(reader.result);
      };
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });

  const saveProfile = async () => {
    setSavingProfile(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        profileImage: form.profileImage,
        jobTitle: form.jobTitle,
        department: form.department,
        bio: form.bio,
        contact: form.contact,
        dateOfBirth: form.dateOfBirth,
        idNumber: form.idNumber,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode,
      }),
    });

    setSavingProfile(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Failed to save profile");
      return;
    }

    const data = await res.json();
    setForm((prev) => ({ ...prev, ...data.user }));
    setMessage("Profile updated successfully");
  };

  const changePassword = async () => {
    setMessage("");

    if (passwordForm.newPassword.length < 8) {
      setMessage("New password must be at least 8 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New password and confirmation do not match");
      return;
    }

    setSavingPassword(true);
    const res = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });
    setSavingPassword(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Failed to update password");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage("Password changed successfully");
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-b from-emerald-50/40 to-transparent min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-0 shadow-md bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <Avatar className="h-24 w-24 border-4 border-emerald-100">
                <AvatarImage src={form.profileImage || ""} alt={form.fullName} />
                <AvatarFallback className="text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Profile Photo</p>
                <Input type="file" accept="image/*" onChange={onImageChange} className="max-w-xs" />
                <p className="text-xs text-muted-foreground">PNG/JPG, max 1.5MB</p>
              </div>
              <div className="sm:ml-auto text-sm text-muted-foreground">
                <p><strong>Role:</strong> {form.role}</p>
                <p><strong>Email:</strong> {form.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={form.fullName || ""} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={form.contact || ""} onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))} />
              </div>
              <div>
                <Label>Job Title</Label>
                <Input value={form.jobTitle || ""} onChange={(e) => setForm((prev) => ({ ...prev, jobTitle: e.target.value }))} placeholder="Optional" />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={form.department || ""} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))} placeholder="Optional" />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={form.dateOfBirth || ""} onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))} />
              </div>
              <div>
                <Label>ID Number</Label>
                <Input value={form.idNumber || ""} onChange={(e) => setForm((prev) => ({ ...prev, idNumber: e.target.value }))} placeholder="Optional" />
              </div>
            </div>

            <div>
              <Label>Bio</Label>
              <textarea
                className="mt-2 min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.bio || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us a little about yourself"
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Address Line 1</Label>
                <Input value={form.address1 || ""} onChange={(e) => setForm((prev) => ({ ...prev, address1: e.target.value }))} />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input value={form.address2 || ""} onChange={(e) => setForm((prev) => ({ ...prev, address2: e.target.value }))} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={form.city || ""} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} />
              </div>
              <div>
                <Label>Province</Label>
                <Input value={form.province || ""} onChange={(e) => setForm((prev) => ({ ...prev, province: e.target.value }))} />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input value={form.postalCode || ""} onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))} />
              </div>
            </div>

            <Button onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} />
              </div>
            </div>
            <Button onClick={changePassword} disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        {message && <p className="text-sm text-emerald-700">{message}</p>}
      </div>
    </div>
  );
}
