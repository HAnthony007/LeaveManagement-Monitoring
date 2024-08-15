import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "./ui/use-toast"
import { departementRegister, departementRegisterType, userRegister, userRegisterType, userType } from "@/schemas/schemaTable"
import { useAddDepartement, useAllDepartement, useUpdateDepartement } from "@/hooks/useDepartement"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Departement } from '@/types/Employe';
import { Separator } from "./ui/separator"
import { useRegister } from "@/hooks/useAuth"
import { toast as toastSonner } from 'sonner';
import { EditIcon } from "./icon/iconApp"
import { useAllUsers } from "@/hooks/useAllEmploye"

type addUserProps = {
    departement?: Departement;
}

export const AddDepartement = ({ departement }: addUserProps) => {

    const { users } = useAllUsers();
    const { add } = useAddDepartement();
    const { updateDepartementData } = useAllDepartement();
    const { updateDepartement } = useUpdateDepartement();

    const form = useForm<departementRegisterType>({
        resolver: zodResolver(departementRegister),
        defaultValues: {
            code_dep: departement?.code_dep || "",
            nom_dep: departement?.nom_dep || "",
            chef_dep: departement?.chef_dep || null,
        },
    })

    async function onSubmit(data: departementRegisterType) {

        console.log(data)
        try {
            if (departement) {
                const updateData = { id_dep: departement.id_dep, ...data }
                await updateDepartement(updateData);
                updateDepartementData();
            } else {
                await add(data);
                updateDepartementData();
            }
            form.reset();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement")
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'enregistrement.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild className={departement ? "m-3" : "m-10"}>
                {departement ?
                    <EditIcon /> : <Button>Ajouter</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <DialogHeader>
                            <DialogTitle>{departement ? "Modification departement" : "Ajout departement"}</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>

                        <Separator className="" />

                        <FormField
                            control={form.control}
                            name="code_dep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code Departement</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Code du departement" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nom_dep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom departement</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom du departement" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="chef_dep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chef Departement</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(value || "")} defaultValue={field.value || ""} >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisisez le chef de departement" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                users.map((user: userType) => (
                                                    <SelectItem key={user.id_empl} value={user.id_empl}>
                                                        {user.nom_empl} {user.prenom_empl}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
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