import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  "data-ocid"?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  "data-ocid": ocid,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      data-ocid={ocid}
    >
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-display text-2xl font-medium text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant="default"
          data-ocid={`${ocid}.button`}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
