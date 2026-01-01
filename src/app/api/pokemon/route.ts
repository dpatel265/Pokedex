import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/models/Pokemon';

export async function GET() {
    await dbConnect();

    try {
        const pokemons = await Pokemon.find({});
        return NextResponse.json({ success: true, data: pokemons });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();

    try {
        const body = await request.json() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        const pokemon = await Pokemon.create(body);
        return NextResponse.json({ success: true, data: pokemon }, { status: 201 });
    } catch (error) {
        console.error('API Error (POST /api/pokemon):', error);
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
