"use client";
import { myCongeType } from "@/schemas/schemaTable";
import { ApiResponse } from "@/types/ApiResponse";
import { AllConge } from "@/types/Employe";
import axiosInstance, { apiUrl } from "@/utils/axiosInstance";
import { fetcher } from "@/utils/fetcher";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

export function useAllConge() {
    const { data: allConge, error, isLoading } = useSWR<ApiResponse<AllConge[]>>(`${apiUrl}/conge/all_conge`,
        fetcher,
        {
            onError: (error) => {
                console.error("An error occurred during fetch", error)
                toast.error("Une erreur est survenue lors de la sélection des conges")
            },
        },
    );

    const updateCongeData = async () => {
        try {
            await mutate(`${apiUrl}/conge/all_conge`);
        } catch (error) {
            console.error("Error updating user data", error);
            toast.error("Unse erreur est survenue lors de la mise a jour de donne des conges");
        }
    }

    return {
        conge: allConge?.data || [],
        isLoading,
        error: error?.message || null,
        updateCongeData
    }
}

export const useAddConge = () => {

    const add_my_conge = async (data: myCongeType) => {
        try {
            const res = await axiosInstance.post('/conge/secure/add_my_conge', data);
            if (!res.data.success) return toast.error(res.data.message);
            toast.success("Conge add Successfully: ", res.data.message);
            return res.data;
        } catch (error) {
            console.error("An error occured during add conge");
            throw error;
        }
    }

    return { add_my_conge };
}