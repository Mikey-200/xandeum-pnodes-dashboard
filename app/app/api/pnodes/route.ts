import { NextResponse } from "next/server";

const PRPC_ENDPOINT = "https://prpc.mainnet.xandeum.network"; // Confirmed working Dec 2025

export async function GET() {
  try {
    const response = await fetch(PRPC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getClusterNodes",
        params: [],
      }),
      next: { revalidate: 60 }, // Cache 60 seconds
    });

    const data = await response.json();
    return NextResponse.json(data.result || []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pNodes" }, { status: 500 });
  }
}
