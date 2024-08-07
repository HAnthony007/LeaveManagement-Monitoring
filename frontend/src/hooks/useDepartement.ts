import { ApiResponse } from "@/types/ApiResponse";
import { Departement } from "@/types/departement";
import { apiUrl } from "@/utils/axiosInstance";
import { fetcher } from "@/utils/fetcher";
import { toast } from "sonner";
import useSWR from "swr";


export function useAllDepartement() {
    const {data: departements, error, isLoading} = useSWR<ApiResponse<Departement[]>>(`${apiUrl}/admin/all_departement`,
        fetcher,
        {
            onError: (error) => {
                console.error("An error occurred during fetch", error)
                toast.error("Une erreur est survenue lors de la sélection des departements")
            },
        },
    );

    console.log(departements?.message)

    return {
        departements: departements?.data || [],
        isLoading,
        error: error?.message || null
    }
}