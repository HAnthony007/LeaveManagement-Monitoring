"use client"
import useSWR from 'swr';
import { Employe } from '../types/employe';
import { useState } from 'react';
import { fetcher } from '@/utils/api';
// import { fetcher } from '@/utils/api';

export default function EmployeListe() {
    const [error, setError] = useState<string | null>(null);
    const { data: employes, isLoading } = useSWR<Employe[]>('http://localhost:8080/employe/all_employe', fetcher, {
        onError: (error) => {
            setError(error.message || "An error occurred while fetching the data.");
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Failed to load: {error}</div>;
    if (!employes || employes.length === 0) return <div>No data</div>;
    return (
        <ul>
            {employes.map(employe => (
                <li key={employe.n_matricule}>
                    <h2>{employe.nom_empl} {employe.prenom_empl}</h2>
                    <p>{employe.email_empl}</p>
                    <p>{employe.role}</p>
                </li>
            ))}
        </ul>
    )
}