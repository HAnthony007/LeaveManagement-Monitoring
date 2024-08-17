"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { departementInfoType, departementType, soldeDataType, userType, userWithoutDepartementType } from "@/schemas/schemaTable";
import { DataTableColumnHeader } from "./column-header";
import { DataTableRowActionsConge, DataTableRowActionsDepartement, DataTableRowActionsUsers } from "./row-actions";
import { Badge } from "../ui/badge";
import { AllConge } from "@/types/Employe";
import { format, parseISO } from "date-fns";

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
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "nom_empl",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
            <div className="flex flex-col ">
                <div className="max-w-[500px] truncate font-medium">
                    {row.getValue("nom_empl")} {row.getValue("prenom_empl")}
                </div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                    {row.getValue("email_empl")}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "prenom_empl",
        enableHiding: true,
    },
    {
        accessorKey: "email_empl",
        enableHiding: true,

    },
    {
        accessorKey: "role",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
        cell: ({ row }) => <div>{row.getValue("role")}</div>,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <Badge variant={"outline"}>{row.getValue("status")}</Badge>,
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
        accessorKey: "solde",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Solde" />,
        cell: ({ row }) => {
            const solde = row.getValue("solde") as soldeDataType;
            return (
                <div>
                    {solde ? solde?.j_reste_sld : "N/A"}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
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
        cell: ({ row }) => {
            const chefDep = row.getValue("chef_dep") as userWithoutDepartementType;
            return (
                <div>
                    {chefDep ? `${chefDep?.prenom_empl} ${chefDep?.nom_empl}` : "N/A"}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsDepartement row={row} />,
    },
]

export const columnsMyConge: ColumnDef<AllConge>[] = [
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
        accessorKey: "date_deb_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Debut du Conge" />,
        cell: ({ row }) => {
            const dateDeb = parseISO(row.getValue("date_deb_cong"))
            const formatteDate = format(dateDeb, "dd MMMM yyyy HH:mm:ss") 
            return (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {formatteDate}
                </span>
            </div>
            )
        },
            enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "date_fin_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fin Conge" />,
        cell: ({ row }) => {
            const dateFin = parseISO(row.getValue("date_fin_cong"))
            const formatteDate = format(dateFin, "dd MMMM yyyy HH:mm:ss") 
            return (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {formatteDate}
                </span>
            </div>
            )
        },
    },
    {
        accessorKey: "motif_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Motif" />,
        cell: ({ row }) => <div>{row.getValue("motif_cong")}</div>,
    },
    {
        accessorKey: "status_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <div>{row.getValue("status_cong")}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsConge row={row} />,
    },
]

export const columnsAllCongeEmploye: ColumnDef<AllConge>[] = [
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
        accessorKey: "date_deb_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Debut du Conge" />,
        cell: ({ row }) => {
            const dateDeb = parseISO(row.getValue("date_deb_cong"))
            const formatteDate = format(dateDeb, "dd MMMM yyyy HH:mm:ss") 
            return (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {formatteDate}
                </span>
            </div>
            )
        },
            enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "date_fin_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fin Conge" />,
        cell: ({ row }) => {
            const dateFin = parseISO(row.getValue("date_fin_cong"))
            const formatteDate = format(dateFin, "dd MMMM yyyy HH:mm:ss") 
            return (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {formatteDate}
                </span>
            </div>
            )
        },
    },
    {
        accessorKey: "motif_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Motif" />,
        cell: ({ row }) => <div>{row.getValue("motif_cong")}</div>,
    },
    {
        accessorKey: "employe",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chef Identifiant" />,
        cell: ({ row }) => {
            const employe = row.getValue("employe") as userWithoutDepartementType;
            return (
                <div>
                    {employe ? employe?.nom_empl : "N/A"} {employe?.prenom_empl}
                </div>
            );
        }
    },
    {
        accessorKey: "status_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <div>{row.getValue("status_cong")}</div>,
    },

    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsConge row={row} />,
    },
]

export const columnsAllConge: ColumnDef<AllConge>[] = [
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
        accessorKey: "date_deb_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Debut du Conge" />,
        cell: ({ row }) => {
            const dateDeb = parseISO(row.getValue("date_deb_cong"))
            const formatteDate = format(dateDeb, "dd MMMM yyyy HH:mm:ss") 
            return (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {formatteDate}
                </span>
            </div>
            )
        },
            enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "date_fin_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fin Conge" />,
        cell: ({ row }) => {
            const dateFin = parseISO(row.getValue("date_fin_cong"))
            const formatteDate = format(dateFin, "dd MMMM yyyy HH:mm:ss") 
            return (
            <div className="flex space-x-2">
                <span className="max-w-[500px] truncate font-medium">
                    {formatteDate}
                </span>
            </div>
            )
        },
    },
    {
        accessorKey: "motif_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Motif" />,
        cell: ({ row }) => <div>{row.getValue("motif_cong")}</div>,
    },
    {
        accessorKey: "employe",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chef Identifiant" />,
        cell: ({ row }) => {
            const employe = row.getValue("employe") as userWithoutDepartementType;
            return (
                <div>
                    {employe ? employe?.nom_empl : "N/A"} {employe?.prenom_empl}
                </div>
            );
        }
    },
    {
        accessorKey: "departement",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Departement" />,
        cell: ({ row }) => {
            const departement = row.getValue("departement") as departementInfoType;
            return (
                <div>
                    {departement ? departement?.code_dep : "N/A"} {departement?.nom_dep}
                </div>
            );
        }
    },
    {
        accessorKey: "status_cong",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <div>{row.getValue("status_cong")}</div>,
    },

    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActionsConge row={row} />,
    },
]