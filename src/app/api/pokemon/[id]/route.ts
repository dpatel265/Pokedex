import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pokemon from '@/models/Pokemon';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        const pokemon = await Pokemon.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!pokemon) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: pokemon });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const deletedPokemon = await Pokemon.findByIdAndDelete(id);

        if (!deletedPokemon) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
