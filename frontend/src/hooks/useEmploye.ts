import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useAllEmploye } from "./useAllEmploye";


export const useDeleteUser = () => {
    const { updateUserData } = useAllEmploye();
    const deleteUser = async (id: string) => {
        try {
            const res = await axiosInstance.delete(`admin/secure/delete_user/${id}`);
            if (!res.data.success) return toast.error(res.data.message);
            console.log("Delete successful: ", res)
            toast.success("Success: ", res.data.message);
            updateUserData();
            return res.data;
        } catch (error) {
            console.error("An error occured during delete user");
            throw error;
        }
    }
    return { deleteUser };
}