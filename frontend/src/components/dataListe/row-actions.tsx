"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { departementSchemas, userSchema } from "@/schemas/schemaTable"
import { labels } from "@/configs/site"
import { Departement, User } from "@/types/Employe"
import { AddUser } from "../AddUser"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { DeleteIcon, EditIcon, ViewEyeIcon } from '../icon/iconApp';
import { toast as toastSonner } from "../ui/use-toast"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { AlertDialogCancel, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { useDeleteUser } from "@/hooks/useEmploye"
import { useDeleteDepartement } from "@/hooks/useDepartement"
import { AddDepartement } from "../AddDepartement"

type DataTableRowActionsPropsUsers = {
    row: Row<User>
}

export function DataTableRowActionsUsers({
    row,
}: DataTableRowActionsPropsUsers) {
    const task = userSchema.parse(row.original) as User;

    const { deleteUser } = useDeleteUser();

    const handleEditClick = (user: User) => {
        toastSonner({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(user, null, 2)}</code>
                </pre>
            ),
        })
    }

    const handleDeleteUser = async () => {
        try {
            await deleteUser(row.original.id_empl)
        } catch (error) {
            console.error("Error while deleting user")
            toast.error("Error while deleting user")
        }
    }

    return (
        <div className="relative flex items-center gap-2">
            <TooltipProvider >
                <Tooltip >
                    <TooltipTrigger>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <ViewEyeIcon />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent >
                        Details
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {/* <EditIcon /> */}
                            <AddUser user={row.original} />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Edit user
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <span className="text-lg text-danger cursor-pointer active:opacity-50 text-red-500 ">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DeleteIcon />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>

                                        <AlertDialogCancel>
                                            <Button variant={"outline"}>
                                                Cancel
                                            </Button>
                                        </AlertDialogCancel>

                                        <AlertDialogAction >
                                            <Button variant={"destructive"}
                                                onClick={handleDeleteUser}
                                            >
                                                Yes, delete user
                                            </Button>
                                        </AlertDialogAction>

                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Delete user
                    </TooltipContent>

                </Tooltip>
            </TooltipProvider>
        </div>
        
    )
}

type DataTableRowActionsPropsDepartement = {
    row: Row<Departement>
}

export function DataTableRowActionsDepartement({
    row,
}: DataTableRowActionsPropsDepartement) {
    const task = departementSchemas.parse(row.original) as Departement;

    const { Delete } = useDeleteDepartement();

    const handleDeleteDepartement = async () => {
        try {
            await Delete(row.original.id_dep) 
        } catch (error) {
            console.error("Error while deleting departement")
            toast.error("Error while deleting departement")
        }
    }
    return (
        <div className="relative flex items-center gap-2">
            <TooltipProvider >
                <Tooltip >
                    <TooltipTrigger>
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <ViewEyeIcon />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent >
                        Details
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            {/* <EditIcon /> */}
                            <AddDepartement departement={row.original} />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Edit user
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
                        <span className="text-lg text-danger cursor-pointer active:opacity-50 text-red-500 ">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DeleteIcon />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>

                                        <AlertDialogCancel>
                                            <Button variant={"outline"}>
                                                Cancel
                                            </Button>
                                        </AlertDialogCancel>

                                        <AlertDialogAction >
                                            <Button variant={"destructive"}
                                                onClick={handleDeleteDepartement}
                                            >
                                                Yes, delete user
                                            </Button>
                                        </AlertDialogAction>

                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        Delete user
                    </TooltipContent>

                </Tooltip>
            </TooltipProvider>
        </div>
    )
}