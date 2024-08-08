"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { departementType, userType } from "@/schemas/schemaTable";
import { DataTableColumnHeader } from "./column-header";
import { DataTableRowActionsDepartement, DataTableRowActionsUsers } from "./row-actions";

export const columnsUsers: ColumnDef<userType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "n_matricule",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Matricule" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("n_matricule")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email_empl",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">{row.getValue("email_empl")}</span>
            </div>
        ),
    },
    {
        accessorKey: "nom_empl",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
        cell: ({ row }) => <div>{row.getValue("nom_empl")}</div>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
        cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <div>{row.getValue("status")}</div>,
    },

    {
        accessorKey: "departement",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Departement" />,
        cell: ({ row }) => {
            const departement = row.getValue("departement") as departementType;
            return (
                <div>
                    {departement ? departement?.nom_dep : "N/A"}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsUsers row={row} />,
    },
]

export const columnsDepartements: ColumnDef<departementType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "code_dep",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code departement" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("code_dep")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "nom_dep",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nom Departement" />,
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">{row.getValue("nom_dep")}</span>
            </div>
        ),
    },
    {
        accessorKey: "chef_dep",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chef Identifiant" />,
        cell: ({ row }) => <div>{row.getValue("chef_dep")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsDepartement row={row} />,
    },
]