import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
        const playersWithClubs = await db.player.findMany({
            include: {
                relatedClub: {
                    select: {
                        name: true // Velg bare navnet på klubben
                    }
                }
            }
        });
        const mapping = playersWithClubs.map((player) => {
            // Hent navnet på klubben fra relatedClub-objektet
            const clubName = player.relatedClub ? player.relatedClub.name : "No club"; 
            return `${player.firstName} ${player.lastName} Club: ${clubName}`; 
        })

        return NextResponse.json({
            players: mapping
        });
    } catch (error) {
        console.error("Error fetching players and their clubs:", error);
        return NextResponse.error();
    }
};