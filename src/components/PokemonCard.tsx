'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Pokemon } from '@/types';

interface PokemonCardProps {
    pokemon: Pokemon;
    onAction: (pokemon: Pokemon) => void;
    actionLabel: string;
    isActionLoading?: boolean;
}

const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    steel: 'bg-slate-400',
    fairy: 'bg-pink-300',
};

const PokemonCard: React.FC<PokemonCardProps> = ({
    pokemon,
    onAction,
    actionLabel,
    isActionLoading = false,
}) => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-md relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.05,
                rotate: 1,
                boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.2)',
            }}
            transition={{ duration: 0.3 }}
        >
            <div className="p-4 flex flex-col items-center">
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="relative w-32 h-32"
                >
                    <Image
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </motion.div>

                <h3 className="mt-2 text-xl font-bold capitalize text-gray-800">
                    {pokemon.nickname || pokemon.name}
                </h3>

                <div className="flex gap-2 mt-2">
                    {pokemon.types.map((type) => (
                        <span
                            key={type}
                            className={`px-2 py-1 text-xs font-semibold text-white rounded-full capitalize ${typeColors[type] || 'bg-gray-400'
                                }`}
                        >
                            {type}
                        </span>
                    ))}
                </div>

                <button
                    onClick={() => onAction(pokemon)}
                    disabled={isActionLoading}
                    className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${actionLabel === 'Release'
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-500'
                        }`}
                >
                    {isActionLoading ? '...' : actionLabel}
                </button>
            </div>
        </motion.div>
    );
};

export default PokemonCard;
