import { NextResponse } from "next/server";

// This is the real working endpoint as of Dec 2025 (confirmed in Xandeum Discord)
const PRPC_ENDPOINT = "https://prpc.mainnet.xandeum.network";

export const dynamic = "force-dynamic";

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
      // Cache for 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("pRPC request failed");

    const data = await response.json();
    return NextResponse.json(data.result || []);
  } catch (error) {
    console.error("pRPC fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch pNodes" }, { status: 500 });
  }
}
