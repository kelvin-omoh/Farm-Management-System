
import https from 'https'
import { NextRequest, NextResponse } from "next/server";



export async function GET(req, { params }) {
    const id = 'T919501412448577'
    console.log(id);
    console.log("slug+" + id);
    try {


        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/verify/' + id,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.trim()}`
            }
        }
        let data = '';

        const reqs = await new Promise((resolve, reject) => {
            const req = https.request(options, response => {
                response.on('data', chunk => {
                    data += chunk;
                });

                response.on('end', () => {

                    resolve(data);
                });
            });

            req.on('error', error => {
                reject(error);
            });


            req.end();
        });

        const responseData = JSON.parse(reqs);
        if (responseData) {
            console.log("RESPONSE:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            console.log(responseData);
            return NextResponse.json(responseData);
        }
    }
    catch (e) {
        console.error(e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}