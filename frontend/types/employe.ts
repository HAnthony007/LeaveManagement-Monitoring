
export interface Employe {
    n_matricule: string;
    id_dep: number | null;
    nom_empl: string;
    prenom_empl: string | null;
    email_empl: string;
    passw_empl: string;
    role: string
}