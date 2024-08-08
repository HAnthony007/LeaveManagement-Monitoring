
export type User = {
    id_empl: string;
    n_matricule: string;
    id_dep: string;
    id_suphier: string | null;
    nom_empl: string;
    prenom_empl?: string;
    email_empl: string;
    passw_empl: string;
    role: string;
    status: string;
    departement: Departement;
}

export type Departement = {
    id_dep: string;
    code_dep: string;
    nom_dep: string;
    chef_dep: string | null;
}

export type AllUsers = {
    length: number,
    map(arg0: (user: any) => import("react").JSX.Element): import("react").ReactNode;
    allUser: AllUsers[];
}