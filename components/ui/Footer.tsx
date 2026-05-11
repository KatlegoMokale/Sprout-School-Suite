"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <footer className="footer justify-center items-center">
      <button onClick={logout} className="bg-white flex justify-center w-full items-center">
        <LogOut className="h-6 w-6 text-gray-700" />
      </button>
    </footer>
  );
};

export default Footer;
