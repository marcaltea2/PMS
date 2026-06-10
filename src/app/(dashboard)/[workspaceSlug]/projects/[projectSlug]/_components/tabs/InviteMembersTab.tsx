"use client";

import { useState } from "react";
import { Send, Link2, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Invite = {
  email: string;
  role: string;
  sent: string;
};

export function InviteMembersTab() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [pending, setPending] = useState<Invite[]>([
    { email: "dev@studio.io",     role: "Member", sent: "2d ago" },
    { email: "design@agency.com", role: "Viewer", sent: "5d ago" },
  ]);

  const handleInvite = () => {
    if (!email.trim()) return;
    setPending([{ email, role, sent: "just now" }, ...pending]);
    setEmail("");
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {/* Invite form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-sm font-medium mb-1">Invite by email</p>
        <p className="text-xs text-muted-foreground mb-4">Send an invite to collaborate on this project.</p>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            className="flex-1 h-9 text-sm"
          />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-28 h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleInvite} className="h-9 gap-1.5 text-xs">
            <Send size={12} /> Send
          </Button>
        </div>
      </div>

      {/* Shareable link */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
            <Link2 size={14} />
          </div>
          <div>
            <p className="text-sm font-medium">Shareable link</p>
            <p className="text-xs text-muted-foreground">Anyone with this link can request access</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-xs h-8">
          Copy link
        </Button>
      </div>

      {/* Pending invites */}
      {pending.length > 0 && (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Pending
          </p>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {pending.map((inv) => (
              <div key={inv.email} className="flex items-center gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                  {inv.email[0] ?? "?"} 
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{inv.email}</p>
                  <p className="text-xs text-muted-foreground">{inv.role} · {inv.sent}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                  Pending
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => setPending(pending.filter((p) => p.email !== inv.email))}
                >
                  <X size={13} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}