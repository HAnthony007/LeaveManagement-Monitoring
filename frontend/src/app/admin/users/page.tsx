"use client"
import { AddUser } from "@/components/AddUser";
import { columnsUsers } from "@/components/dataListe/columns";
import { DataTable } from "@/components/dataListe/data-table";
import { UserNav } from "@/components/dataListe/user-nav";
import { Button } from "@/components/ui/button";
import { useAllEmploye } from "@/hooks/useAllEmploye";

export default function UsersPage() {
  const { users } = useAllEmploye();

  return (
  <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bienvenue a nouveau</h2>
          <p className="text-muted-foreground">
            Voici la liste de tous les utilisateurs.
          </p>
        </div>
        <div className="flex items-center space-x-2 w-full">
          <AddUser />
        </div>
      </div>
      <DataTable data={users} columns={columnsUsers} />
    </div>
  );
}
