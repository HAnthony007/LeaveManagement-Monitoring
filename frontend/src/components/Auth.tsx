"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/schemas/authentification"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { PasswordInput } from "./ui/input-password"
import { Email } from "./icon/iconApp"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useLogin } from "@/hooks/useAuth"

export function LoginForm() {
    const goTo = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { login } = useLogin();

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            const res = await login(values.email, values.password);
            console.log("Response login: ", res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} suffix={<Email />}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
