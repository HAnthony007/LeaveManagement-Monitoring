import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useAllEmployes } from "./useAllEmploye";
import { userWithoutDepartementType } from "@/schemas/schemaTable";


export const useDeleteUser = () => {
    const { updateEmployeData } = useAllEmployes();
    const deleteUser = async (id: string) => {
        try {
            const res = await axiosInstance.delete(`employe/secure/delete_user/${id}`);
            if (!res.data.success) return toast.error(res.data.message);
            console.log("Delete successful: ", res)
            toast.success("Delete success: ", res.data?.message);
            updateEmployeData();
            return res.data;
        } catch (error) {
            console.error("An error occured during delete user");
            throw error;
        }
    }
    return { deleteUser };
}

export const useUpdateUser = () => {
    const { updateEmployeData } = useAllEmployes();    
    const updateUser = async (id_empl: string, data: userWithoutDepartementType) => {
        try {
            const res = await axiosInstance.post(`employe/secure/update_employe/${id_empl}`, data);

            if (!res.data.success) return toast.error(res.data.message);
            toast.success("Update success: ", res.data.message);
            updateEmployeData();            
            return res.data;
        } catch (error) {
            console.error("Error updating user ", error);
            throw error;
        }
    }

    return {updateUser}
}