"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white",
        nav: "flex items-center gap-1",
        button_previous:
          "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 inline-flex items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors z-10",
        button_next:
          "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 inline-flex items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors z-10",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-white/50 rounded-md w-10 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "p-0 text-center text-sm",
        day_button: cn(
          "h-10 w-10 p-0 font-normal inline-flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer",
          "text-white/80 hover:bg-neon-pink/20 hover:text-white",
          "aria-selected:bg-neon-pink aria-selected:text-white aria-selected:font-semibold aria-selected:shadow-[0_0_15px_rgba(255,45,123,0.5)]"
        ),
        selected: "bg-neon-pink text-white",
        today: "border border-neon-pink/50 text-neon-pink font-semibold",
        outside: "text-white/20 aria-selected:text-white/40",
        disabled: "text-white/20 cursor-not-allowed opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeft className="h-[18px] w-[18px]" />;
          return <ChevronRight className="h-[18px] w-[18px]" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
