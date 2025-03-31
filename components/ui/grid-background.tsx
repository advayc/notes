import React from "react";
import { cn } from "@/lib/utils";

interface GridBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number;
  gridOpacity?: number;
  gridColor?: string;
  gridClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

export const GridBackground = ({
  gridSize = 40,
  gridOpacity = 0.02,
  gridColor = "#fff",
  className,
  gridClassName,
  containerClassName,
  children,
  ...props
}: GridBackgroundProps) => {
  return (
    <div className={cn("relative", className)} {...props}>
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          containerClassName
        )}
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundOpacity: gridOpacity,
          opacity: gridOpacity,
        }}
      />
      
      {/* Optional additional grid styling */}
      {gridClassName && (
        <div className={cn("absolute inset-0 z-0", gridClassName)} />
      )}
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GridBackground; 