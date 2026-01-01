import Link from 'next/link';
import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-red-200 transition-colors">
                    Pokédex
                </Link>
                <div className="space-x-4">
                    <Link href="/" className="font-medium hover:text-red-200 transition-colors">
                        Home
                    </Link>
                    <Link href="/pokedex" className="font-medium hover:text-red-200 transition-colors">
                        My Pokémon
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
