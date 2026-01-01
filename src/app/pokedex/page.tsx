'use client';

import { useState, useEffect } from 'react';
import PokemonCard from '@/components/PokemonCard';
import EditModal from '@/components/EditModal';
import { Pokemon } from '@/types';
import { motion } from 'framer-motion';

export default function PokedexPage() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);


    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPokemon, setEditingPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        fetchPokemons();
    }, []);

    const fetchPokemons = async () => {
        try {
            const response = await fetch('/api/pokemon');
            const data: any = await response.json(); // eslint-disable-line @typescript-eslint/no-explicit-any
            if (data.success) {
                setPokemons(data.data);
            }
        } catch (error) {
            console.error('Error fetching pokedex:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async (pokemon: Pokemon) => {
        if (!confirm(`Are you sure you want to release ${pokemon.nickname || pokemon.name}?`)) return;

        // Optimistic update
        setPokemons(prev => prev.filter(p => p._id !== pokemon._id));

        try {
            await fetch(`/api/pokemon/${pokemon._id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error releasing pokemon:', error);
            // Revert if failed (could implement better rollback, but fetch refresh is safer)
            fetchPokemons();
        }
    };

    const openEditModal = (pokemon: Pokemon) => {
        setEditingPokemon(pokemon);
        setIsEditModalOpen(true);
    };

    const handleSaveNickname = async (newNickname: string) => {
        if (!editingPokemon || !editingPokemon._id) return;

        setIsEditModalOpen(false);
        const originalPokemons = [...pokemons];

        // Optimistic update
        setPokemons(prev => prev.map(p =>
            p._id === editingPokemon._id ? { ...p, nickname: newNickname } : p
        ));

        try {
            const response = await fetch(`/api/pokemon/${editingPokemon._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname: newNickname }),
            });

            if (!response.ok) {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Error updating nickname:', error);
            alert('Failed to update nickname');
            setPokemons(originalPokemons);
        } finally {
            setEditingPokemon(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-blue-600">
                    My Pokédex
                </h1>
                <p className="text-lg text-gray-600">
                    Manage your collection. Release them back into the wild or give them a nickname!
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {pokemons.length === 0 ? (
                        <div className="text-center py-20 bg-gray-100 rounded-3xl">
                            <h3 className="text-2xl font-bold text-gray-400">Your Pokédex is empty!</h3>
                            <p className="text-gray-500 mt-2">Go catch some Pokémon in the wild.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            layout
                        >
                            {pokemons.map((pokemon) => (
                                <div key={pokemon._id} className="relative group">
                                    <PokemonCard
                                        pokemon={pokemon}
                                        onAction={() => openEditModal(pokemon)}
                                        actionLabel="Rename"
                                        isActionLoading={false}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRelease(pokemon);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm z-10"
                                        title="Release"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </>
            )}

            {editingPokemon && (
                <EditModal
                    isOpen={isEditModalOpen}
                    initialValue={editingPokemon.nickname || editingPokemon.name}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveNickname}
                    title={`Rename ${editingPokemon.name}`}
                />
            )}
        </div>
    );
}
