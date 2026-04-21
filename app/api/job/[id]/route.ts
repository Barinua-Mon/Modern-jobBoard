import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request, {params}: {params: Promise<{id: string}>}) {
    const session = await auth()

    try{

        //EXTRACT ID FROM THE PARAMS
        const {id} = await params;
    
        //QUERY DATABASE BASED ON ID
        const job = await prisma.job.findUnique({
            where: {id}
        })
    
        //SEND RESPONSE IF SUCCESSFUL
        return NextResponse.json(
            job, 
            {status: 200}
        )

    }catch(err){
        //LOG THE ERROR(S)
        const error = err as Error;
        console.log("error:", error);

        //SEND RESPONSE IF FAIL
        return NextResponse.json(
            {status: "fail", message: error.message},
            {status: 404}
        )
    }
    
}