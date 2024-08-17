"use client"

import { MyCalendar } from "@/components/Calendar/BasicCalendar";
import { useAllMyConge } from "@/hooks/useConge";

export default function CalendrierPage() {
  const { myConge } = useAllMyConge();

  return (
    <div className=" h-screen flex-1 flex-col space-y-8 p-8 md:flex">
      HEllo calendar
      <MyCalendar events={myConge} />
    </div>
  );
}
