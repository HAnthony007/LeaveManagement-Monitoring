"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Row, Table } from "@tanstack/react-table"

// import { DataTableViewOptions } from "@/app/(app)/examples/tasks/components/data-table-view-options"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { priorities, statuses } from "@/configs/site"
import { DataTableFacetedFilter } from "./faceted-filter"
import { DataTableViewOptions } from "./view-option"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbarUsers<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    // const filterByName = (value: string) => {
    //     table
    //         .getColumn("nom_empl")
    //         ?.setFilterValue((row: Row<TData>) => {
    //             const nomEmpl = row.getValue("nom_empl").toLowerCase();
    //             const prenomEmpl = row.getValue("prenom_empl").toLowerCase();
    //             return (
    //                 nomEmpl.includes(value.toLowerCase()) ||
    //                 prenomEmpl.includes(value.toLowerCase())
    //             );
    //         });
    // };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("nom_empl")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("nom_empl")?.setFilterValue(event.target.value)
                    }}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
                
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}


export function DataTableToolbarDepartement<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    // const filterByName = (value: string) => {
    //     table
    //         .getColumn("nom_empl")
    //         ?.setFilterValue((row: Row<TData>) => {
    //             const nomEmpl = row.getValue("nom_empl").toLowerCase();
    //             const prenomEmpl = row.getValue("prenom_empl").toLowerCase();
    //             return (
    //                 nomEmpl.includes(value.toLowerCase()) ||
    //                 prenomEmpl.includes(value.toLowerCase())
    //             );
    //         });
    // };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("nom_dep")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn("nom_dep")?.setFilterValue(event.target.value)
                    }}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}