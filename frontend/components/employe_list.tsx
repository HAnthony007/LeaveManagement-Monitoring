"use client"
import useSWR from 'swr';
import { Employe } from '../types/employe';
// import { fetcher } from '@/utils/api';

const fetcher = (url: string) => fetch(url).then(res => res.json());
export default function EmployeListe() {
    const { data: employes, error, isLoading } = useSWR<Employe[]>('http://localhost:8080/employe/all_employe', fetcher);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Failed to load</div>;
    if (!employes) return <div>No data</div>;
    return (
        <div>
            {employes.map(employe => (
                <div key={employe.n_matricule}>
                    <h2>{employe.nom_empl}</h2>
                    <p>{employe.email_empl}</p>
                    <p>{employe.role}</p>
                </div>
            ))}
        </div>
    )
}