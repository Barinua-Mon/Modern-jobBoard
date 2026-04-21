import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {

        const jobs = await prisma.job.findMany();   
        
        return NextResponse.json(
                jobs,
            { status: 200 }
        )

    } catch (err) {
        const error = err as Error;
        console.log("Error:", error.message);

        return NextResponse.json(
            { status: "fail", Message: error.message },
            { status: 404 }
        )
    };
}