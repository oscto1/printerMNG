import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/[locale]/lib/apiUtils";

export async function POST(request: NextRequest) {
    const credentials = await request.json();

    const apiResponse = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    if (!apiResponse.ok) {
        return new NextResponse(await apiResponse.text(), {
            status: apiResponse.status,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    const { accessToken } = await apiResponse.json();

    const response = NextResponse.json({ success: true });

    response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60
    });

    return response;
}