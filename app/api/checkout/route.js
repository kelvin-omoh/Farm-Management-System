import { NextRequest, NextResponse } from "next/server";
import Order from "../../models/Order";
import { initMongoose } from "@/app/lib/mongoose";

export const POST = async (req) => {
    try {
        await initMongoose();
        const { address, city, name, email, line_items, metaData } = await req.json();

        const createdOrder = await Order.create({
            name,
            email,
            line_items,
            paid: true,
            address,
            city,
            metaData
        });

        return new NextResponse.json(createdOrder, { status: 200 });
    }
    catch (e) {
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
