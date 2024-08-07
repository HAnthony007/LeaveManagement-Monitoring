import { useAuthStore } from "@/stores/AuthStore";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export const useLogin = () => {
    const router = useRouter();

    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    const login = async (email_empl: string, passw_empl: string) => {
        try {
            const res = await axiosInstance.post('/auth/login', { email_empl, passw_empl });

            if (!res.data.success) return toast.error(res.data.message);
            const { user, token } = res.data.data;
            const role = user.role.toLowerCase();
            setUser(user);
            setToken(token, role);

            toast.success("Login Successfully");

            router.push(`/${user.role.toLowerCase()}/dashboard`);
            console.log("Voici le user: ")
            console.log(user);

            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { login };
}