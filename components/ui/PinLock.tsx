"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface PinLockProps {
  onUnlock: () => void;
  children: React.ReactNode;
}

const ADMIN_PIN = "1234"; // In a real application, this should be stored securely

export default function PinLock({ onUnlock, children }: PinLockProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsUnlocked(true);
      onUnlock();
      setError(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  className="text-center text-2xl tracking-widest"
                />
                {error && (
                  <p className="text-sm text-red-500 text-center">
                    Incorrect PIN. Please try again.
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 