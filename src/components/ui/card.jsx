import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col gap-6 py-6",
        className
      )}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef(function CardHeader(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  );
});

const CardTitle = React.forwardRef(function CardTitle(
  { className, ...props },
  ref
) {
  return (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
});

const CardDescription = React.forwardRef(function CardDescription(
  { className, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

const CardContent = React.forwardRef(function CardContent(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
});

const CardFooter = React.forwardRef(function CardFooter(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  );
});

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
