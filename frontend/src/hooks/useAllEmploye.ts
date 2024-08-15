"use client";
import { ApiResponse } from "@/types/ApiResponse"
import { User } from "@/types/Employe"
import { apiUrl } from "@/utils/axiosInstance";
import { fetcher } from "@/utils/fetcher";
import { toast } from "sonner";
import useSWR, { mutate } from "swr"


export function useAllUsers() {
    const { data: users, error, isLoading } = useSWR<ApiResponse<User[]>>(`${apiUrl}/employe/secure/all_user`,
        fetcher,
        {
            onError: (error) => {
                console.error("An error occurred during fetch", error)
                toast.error("Une erreur est survenue lors de la récupération des employés")
            },
        },
    );


    const updateUserData = async () => {
        try {
            await mutate(`${apiUrl}/employe/secure/all_user`);
        } catch (error) {
            console.error("Error updating user data", error);
            toast.error("Unse erreur est survenue lors de la mise a jour de donne des employes");
        }
    }

    return {
        users: users?.data || [],
        isLoading,
        error: error?.message || null,
        updateUserData
    };
}

export function useAllEmployes() {
    const { data: employes, error, isLoading } = useSWR<ApiResponse<User[]>>(`${apiUrl}/employe/secure/all_employe`,
        fetcher,
        {
            onError: (error) => {
                console.error("An error occurred during fetch", error)
                toast.error("Une erreur est survenue lors de la sélection des employés")
            },
        },
    );

    const updateEmployeData = async () => {
        try {
            await mutate(`${apiUrl}/employe/secure/all_employe`);
        } catch (error) {
            console.error("Error updating user data", error);
            toast.error("Unse erreur est survenue lors de la mise a jour de donne des employes");
        }
    }

    return {
        employes: employes?.data || [],
        isLoading,
        error: error?.message || null,
        updateEmployeData
    };
}