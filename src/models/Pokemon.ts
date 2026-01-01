import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPokemon extends Document {
    id: number;
    name: string;
    types: string[];
    sprite: string;
    nickname?: string;
}

const PokemonSchema: Schema = new Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    types: { type: [String], required: true },
    sprite: { type: String, required: true },
    nickname: { type: String, required: false },
});

// Check if model already exists to prevent overwrite error in dev
const Pokemon: Model<IPokemon> = mongoose.models.Pokemon || mongoose.model<IPokemon>('Pokemon', PokemonSchema);

export default Pokemon;
