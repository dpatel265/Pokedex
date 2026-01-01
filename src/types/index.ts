export interface Pokemon {
    id: number;
    name: string;
    types: string[];
    sprite: string;
    nickname?: string;
    _id?: string; // MongoDB ID
}

export interface PokeApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        name: string;
        url: string;
    }[];
}

export interface PokemonDetailResponse {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: {
        type: {
            name: string;
        };
    }[];
}
