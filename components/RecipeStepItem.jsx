"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function RecipeStepItem({ step, onChange, onAdd, onDelete, onAddAttachment }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="gap-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-4 mb-2">
        <Input
          value={step.text}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background/50 border border-muted rounded-md text-sm flex-1"
        />

        {/* Tombol Add di luar Dropdown Menu */}
        <Button
            type="button" 
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onAdd}
        >
          +
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
            
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-muted/20"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onAdd}>Tambah langkah</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Hapus langkah ini</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
