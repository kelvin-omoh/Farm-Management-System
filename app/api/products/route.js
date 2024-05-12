import { NextRequest, NextResponse } from "next/server";
import Product from "../../models/Product";
import { initMongoose } from "@/app/lib/mongoose";


export async function GET(req, res) {
    try {

        await initMongoose();
        const id = req.nextUrl?.searchParams.get('ids');

        if (id) {
            const idsArray = id.split(',');
            // console.log(idsArray);
            const ress = await Product.find({
                '_id': { $in: idsArray }
            })
            // console.log(ress);
            return NextResponse.json(ress);
        } else {
            return NextResponse.json(await Product.find())
        }
    }
    catch (e) {
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}
