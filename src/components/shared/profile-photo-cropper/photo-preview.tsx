import { memo } from "react";

import { Pencil, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { PhotoPreviewProps } from "./types";

export const PhotoPreview = memo(function PhotoPreview({
  previewUrl,
  initials,
  onEdit,
  onRemove,
}: PhotoPreviewProps) {
  return (
    <div className="group relative">
      <Avatar className="border-border h-32 w-32 border-2">
        <AvatarImage src={previewUrl} alt="Profile photo" />
        <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Edit overlay */}
      <div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={onEdit}
            className="h-8 w-8"
            aria-label="Edit photo"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={onRemove}
            className="h-8 w-8"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
});
