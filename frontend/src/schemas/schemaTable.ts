import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema= z.object({
    n_matricule: z.string().min(2, "Matricule must be at least 2 characters"),
    id_dep: z.number().int().optional().nullable(),
    nom_empl: z.string().min(1, "Nom required"),
    prenom_empl: z.string().optional(),
    email_empl: z.string().email("Email must be valid"),
    passw_empl: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role required"),
});

export const departementSchemas= z.object({
    id_dep: z.number().int(),
    nom_dep: z.string().min(1, "Nom required"),
    id_dir: z.string().optional().nullable(),
})

export type userType= z.infer<typeof userSchema>;

export type departementType= z.infer<typeof departementSchemas>;