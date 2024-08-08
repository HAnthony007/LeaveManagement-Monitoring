"use client";
import { ApiResponse } from "@/types/ApiResponse"
import { User } from "@/types/Employe"
import { apiUrl } from "@/utils/axiosInstance";
import { fetcher } from "@/utils/fetcher";
import { toast } from "sonner";
import useSWR from "swr"


export function useAllEmploye() {
    const { data: users, error, isLoading } = useSWR<ApiResponse<User[]>>(`${apiUrl}/employe/all_employe`,
        fetcher,
        {
            onError: (error) => {
                console.error("An error occurred during fetch", error)
                toast.error("Une erreur est survenue lors de la récupération des employés")
            },
        },
    );

    console.log(users?.message)
    

    return {
        users: users?.data || [],
        isLoading,
        error: error?.message || null
    };
}