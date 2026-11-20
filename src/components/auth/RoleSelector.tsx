"use client";

import { BookOpen, UserCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { SignupRole } from "@/types/auth";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: SignupRole;
  onChange: (role: SignupRole) => void;
  disabled?: boolean;
}

export function RoleSelector({
  value,
  onChange,
  disabled,
}: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-foreground">I am a</Label>
      <div
        role="radiogroup"
        aria-label="Select your account role"
        className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/60 p-1.5"
      >
        <button
          type="button"
          role="radio"
          aria-checked={value === "student"}
          disabled={disabled}
          onClick={() => onChange("student")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm",
            value === "student"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-transparent text-secondary-foreground hover:bg-card/80"
          )}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Student</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={value === "tutor"}
          disabled={disabled}
          onClick={() => onChange("tutor")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm",
            value === "tutor"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-transparent text-secondary-foreground hover:bg-card/80"
          )}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Tutor</span>
        </button>
      </div>
    </div>
  );
}