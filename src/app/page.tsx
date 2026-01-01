'use client';

import { useState, useEffect } from 'react';
import PokemonCard from '@/components/PokemonCard';
import { Pokemon, PokeApiResponse, PokemonDetailResponse } from '@/types';
import { motion } from 'framer-motion';

export default function Home() {
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(true);
	const [catchingId, setCatchingId] = useState<number | null>(null);

	useEffect(() => {
		const fetchPokemons = async () => {
			try {
				const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
				const data: PokeApiResponse = await response.json();

				const detailedPokemons = await Promise.all(
					data.results.map(async (result) => {
						const res = await fetch(result.url);
						const details: PokemonDetailResponse = await res.json();
						return {
							id: details.id,
							name: details.name,
							types: details.types.map((t) => t.type.name),
							sprite: details.sprites.other?.['official-artwork'].front_default || details.sprites.front_default,
						};
					})
				);

				setPokemons(detailedPokemons);
				setFilteredPokemons(detailedPokemons);
			} catch (error) {
				console.error('Error fetching pokemon:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPokemons();
	}, []);

	useEffect(() => {
		const filtered = pokemons.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase())
		);
		setFilteredPokemons(filtered);
	}, [search, pokemons]);

	const handleCatch = async (pokemon: Pokemon) => {
		setCatchingId(pokemon.id);
		try {
			const response = await fetch('/api/pokemon', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(pokemon),
			});

			if (response.ok) {
				alert(`Gotcha! ${pokemon.name} was caught!`);
			} else {
				const errorData: any = await response.json(); // eslint-disable-line @typescript-eslint/no-explicit-any
				console.error('Catch failed:', errorData);
				alert(`Failed to catch ${pokemon.name}: ${errorData.error?.message || errorData.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error catching pokemon:', error);
			alert('Error catching pokemon. Check console for details.');
		} finally {
			setCatchingId(null);
		}
	};

	return (
		<div className="space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-red-600">
					Wild Pokémon
				</h1>
				<p className="text-lg text-gray-600">
					Search and catch your favorite Pokémon to add them to your collection!
				</p>
				<div className="max-w-md mx-auto">
					<input
						type="text"
						placeholder="Search Pokémon..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow outline-none"
					/>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
				</div>
			) : (
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					{filteredPokemons.map((pokemon) => (
						<PokemonCard
							key={pokemon.id}
							pokemon={pokemon}
							onAction={handleCatch}
							actionLabel="Catch!"
							isActionLoading={catchingId === pokemon.id}
						/>
					))}
				</motion.div>
			)}

			{!loading && filteredPokemons.length === 0 && (
				<p className="text-center text-gray-500 text-lg">No Pokémon found.</p>
			)}
		</div>
	);
}
