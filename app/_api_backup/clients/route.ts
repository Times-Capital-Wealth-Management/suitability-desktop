import { MOCK_CLIENTS } from "@/app/clients/data";

export const dynamic = 'force-static';

export async function GET() {
    await new Promise((r) => setTimeout(r, 250)); // simulate latency
    return Response.json(MOCK_CLIENTS); // { items, total }
}