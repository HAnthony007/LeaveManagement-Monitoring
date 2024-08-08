import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.


export const departementSchemas= z.object({
    id_dep: z.string(),
    code_dep: z.string().min(1, "Code departement required"),
    nom_dep: z.string().min(1, "Nom required"),
    chef_dep: z.string().nullable(),
})

export const userSchema= z.object({
    id_empl: z.string(),
    n_matricule: z.string().min(2, "Matricule must be at least 2 characters"),
    id_dep: z.string(),
    id_suphier: z.string().nullable(),
    nom_empl: z.string().min(1, "Nom required"),
    prenom_empl: z.string().optional(),
    email_empl: z.string().email("Email must be valid"),
    passw_empl: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role required"),
    status: z.string().min(1, "Status required"),
    departement: departementSchemas,
});

export type userType= z.infer<typeof userSchema>;

export type departementType= z.infer<typeof departementSchemas>;