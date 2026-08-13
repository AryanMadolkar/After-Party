"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNameAction } from "@/app/app/settings/actions";

export function NameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await updateNameAction({ name });
      toast.success("Name updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't update your name.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 max-w-sm">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
      </div>
      <Button type="submit" disabled={pending || !name.trim()}>
        Save
      </Button>
    </form>
  );
}
