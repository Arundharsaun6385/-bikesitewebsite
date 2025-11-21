import * as React from "react";
import clsx from "clsx";

// Card container
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "rounded-2xl border border-gray-200 bg-white shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Card body/content area
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("p-4 text-sm text-gray-700", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

export { Card, CardContent };
