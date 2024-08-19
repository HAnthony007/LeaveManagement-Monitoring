"use client"

import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Button as ButtonAntd } from "antd";
import { allCongeSchema, allCongeType, departementSchemas, userSchema, userType } from "@/schemas/schemaTable"
import { labels } from "@/configs/site"
import { AllConge, Departement, User } from "@/types/Employe"
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
import { ViewUser } from "../ViewUser"
import { EditUser } from "../EditUser"
import { useAuthStore } from "@/stores/AuthStore"
import { useAllConge, useAllMyEmployeConge, useApproveConge, useDeclineConge } from "@/hooks/useConge";

type DataTableRowActionsPropsUsers = {
    row: Row<userType>
}

export function DataTableRowActionsUsers({
    row,
}: DataTableRowActionsPropsUsers) {
    const task = userSchema.parse(row.original) as userType;

    const { deleteUser } = useDeleteUser();
    const { user } = useAuthStore();

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
        <div className="relative flex items-center gap-2 justify-start">
            <TooltipProvider >
                <Tooltip >
                    <TooltipTrigger>
                        <ViewUser user={row.original} />
                    </TooltipTrigger>
                    <TooltipContent >
                        Details
                    </TooltipContent>
                </Tooltip>
                {
                    user?.role != "admin" ?
                        null
                        :
                        <>
                            <Tooltip>
                                <TooltipTrigger >
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EditUser user={row.original} />
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
                        </>
                }

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



type DataTableRowActionsPropsAllConge = {
    row: Row<AllConge>
}

export function DataTableRowActionsCongeEmploye({
    row,
}: DataTableRowActionsPropsAllConge) {
    const task = allCongeSchema.parse(row.original) as allCongeType;

    const { declineConge } = useDeclineConge();

    const { updateMyEmployeCongeData } = useAllMyEmployeConge();

    const { approveConge } = useApproveConge();

    const handleApproveConge = async () => {
        try {
            await approveConge(row.original.id_cong)
            updateMyEmployeCongeData();
        } catch (error) {
            console.error("Error while approving conge")
            toast.error("Error while approving conge")
        }
    }

    const handleRejectConge = async () => {
        try {
            await declineConge(row.original.id_cong)
            updateMyEmployeCongeData();
        } catch (error) {
            console.error("Error while decline conge")
            toast.error("Error while decline conge")
        }
    }

    return (
        <div className="relative flex items-center gap-2 text-center">
            {
                row.original.status_cong.includes("Refuser") ? "Conge annuler" :
                    row.original.status_cong.includes("RH") ? "Approuver par DTP" :
                        row.original.status_cong.includes("Approuver") ? "Approuver" :
                            (
                                <TooltipProvider >
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50 text-red-500 ">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        {/* <DeleteIcon /> */}
                                                        <Button>Approve</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently approve her conge from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>

                                                            <AlertDialogCancel>
                                                                <Button variant={"outline"}>
                                                                    Cancel
                                                                </Button>
                                                            </AlertDialogCancel>

                                                            <AlertDialogAction >
                                                                <Button
                                                                    onClick={handleApproveConge}
                                                                >
                                                                    Yes, approve conge
                                                                </Button>
                                                            </AlertDialogAction>

                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Approve conge
                                        </TooltipContent>

                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50 text-red-500 ">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        {/* <DeleteIcon /> */}
                                                        <Button variant={"destructive"}>Reject</Button>
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
                                                                    onClick={handleRejectConge}
                                                                >
                                                                    Yes, reject conge
                                                                </Button>
                                                            </AlertDialogAction>

                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Reject conge
                                        </TooltipContent>

                                    </Tooltip>
                                </TooltipProvider>

                            )
            }
        </div>

    )
}


export function DataTableRowActionsConge({
    row,
}: DataTableRowActionsPropsAllConge) {
    const task = allCongeSchema.parse(row.original) as allCongeType;

    const { updateCongeData } = useAllConge();

    const { declineConge } = useDeclineConge();

    const { approveConge } = useApproveConge();

    const handleApproveConge = async () => {
        try {
            await approveConge(row.original.id_cong);
            updateCongeData();
        } catch (error) {
            console.error("Error while approving conge")
            toast.error("Error while approving conge")
        }
    }

    const handleRejectConge = async () => {
        try {
            await declineConge(row.original.id_cong);
            updateCongeData();
        } catch (error) {
            console.error("Error while decline conge")
            toast.error("Error while decline conge")
        }
    }

    return (
        <div className="relative flex items-center gap-2">
            {
                row.original.status_cong.includes("Refuser") ? "Conge annuler" :
                    row.original.status_cong.includes("DTP") ? "Attente DTP" :
                        row.original.status_cong.includes("Approuver") ? "Approuver" :
                            (
                                <TooltipProvider >
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50 text-red-500 ">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        {/* <DeleteIcon /> */}
                                                        <Button>Approve</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently approve her conge from our servers.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>

                                                            <AlertDialogCancel>
                                                                <Button variant={"outline"}>
                                                                    Cancel
                                                                </Button>
                                                            </AlertDialogCancel>

                                                            <AlertDialogAction >
                                                                <Button
                                                                    onClick={handleApproveConge}
                                                                >
                                                                    Yes, approve conge
                                                                </Button>
                                                            </AlertDialogAction>

                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Approve conge
                                        </TooltipContent>

                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50 text-red-500 ">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        {/* <DeleteIcon /> */}
                                                        <Button variant={"destructive"}>Reject</Button>
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
                                                                    onClick={handleRejectConge}
                                                                >
                                                                    Yes, reject conge
                                                                </Button>
                                                            </AlertDialogAction>

                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Reject conge
                                        </TooltipContent>

                                    </Tooltip>
                                </TooltipProvider>

                            )
            }
        </div>

    )
}
