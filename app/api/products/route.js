import { NextRequest, NextResponse } from "next/server";
import Product from "../../models/Product";
import { initMongoose } from "@/app/lib/mongoose";

export async function GET(req) {
    try {
        await initMongoose();

        const id = req.nextUrl?.searchParams.get('ids');

        if (id) {
            const idsArray = id.split(',');
            const products = await Product.find({
                '_id': { $in: idsArray }
            });
            return NextResponse.json(products);
        } else {
            const allProducts = await Product.find();
            return NextResponse.json(allProducts);
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
