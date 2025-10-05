"use client";
import { useParams } from 'next/navigation';

export default function ConsecuenciasPage() {
    const params = useParams();
    const { id } = params;

    return (
        <main>
            <h1>Consecuencias</h1>
            <p>ID del parámetro: {id}</p>
        </main>
    );
}