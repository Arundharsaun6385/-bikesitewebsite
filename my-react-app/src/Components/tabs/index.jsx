import * as React from "react";
import {
  Root as TabsPrimitive,
  List as TabsListPrimitive,
  Trigger as TabsTriggerPrimitive,
  Content as TabsContentPrimitive,
} from "@radix-ui/react-tabs";

import clsx from "clsx";

// Tabs Root
const Tabs = ({ className, ...props }) => (
  <TabsPrimitive className={clsx("w-full", className)} {...props} />
);

// Tabs List
const TabsList = ({ className, ...props }) => (
  <TabsListPrimitive
    className={clsx(
      "inline-flex w-full items-center justify-center rounded-md bg-gray-100 p-1",
      className
    )}
    {...props}
  />
);

// Tabs Trigger
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsTriggerPrimitive
    ref={ref}
    className={clsx(
      "flex-1 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:text-black data-[state=active]:bg-white data-[state=active]:text-black",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger, TabsContentPrimitive as TabsContent };
