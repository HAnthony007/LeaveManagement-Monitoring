import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "./ui/use-toast"
import { userSchema, userType } from "@/schemas/schemaTable"

export const AddUser = () => {
    const form = useForm<userType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            n_matricule: "",
            id_dep: null,
            nom_empl: "",
            prenom_empl: "",
            email_empl: "",
            passw_empl: "",
            role: "",
        },
    })

    function onSubmit(data: userType) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="n_matricule"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>N. Matricule</FormLabel>
                                    <FormControl>
                                        <Input placeholder="numero matricule" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="id_dep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>N. Matricule</FormLabel>
                                    <FormControl>
                                        <Input type="" placeholder="numero matricule" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="nom_empl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="votre nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prenom_empl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prenom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre prenom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email_empl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passw_empl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de Passe</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre Mot de passe" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre Role" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Ajouter</Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}