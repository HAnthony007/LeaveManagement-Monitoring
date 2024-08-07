
export type User = {
    id_empl: number;
    n_matricule: string;
    nom_empl: string;
    email_empl: string;
    passw_empl: string;
    role: string;
    id_dep?: number;
    prenom_empl?: string;
}

export type AllUsers = {
    length: number,
    map(arg0: (user: any) => import("react").JSX.Element): import("react").ReactNode;
    allUser: AllUsers[];
}