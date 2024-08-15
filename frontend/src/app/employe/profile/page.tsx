"use client"
import { AddConge } from "@/components/AddConge";
import { columnsAllConge } from "@/components/dataListe/columns";
import { DataTable } from "@/components/dataListe/data-table";
import { UserNav } from "@/components/dataListe/user-nav";
import { useAllConge } from "@/hooks/useConge";

export default function ProfilePage() {
  const { conge } = useAllConge();
  return (
    <div className=" h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <h1>Bonjour toi</h1>
    </div>
  );
}
