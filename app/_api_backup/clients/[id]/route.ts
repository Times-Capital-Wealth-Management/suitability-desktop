import { MOCK_CLIENTS } from "@/app/clients/data";

// 1. Force static behavior for export compatibility
export const dynamic = 'force-static';

// 2. Tell Next.js which IDs exist so it can pre-generate them (or handle them in dev)
export async function generateStaticParams() {
    return MOCK_CLIENTS.items.map((client) => ({
        id: client.id,
    }));
}

// 3. Update GET signature: params is now a Promise in Next.js 15
export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params; // Await the params

    await new Promise((r) => setTimeout(r, 250)); // simulate latency

    const client = MOCK_CLIENTS.items.find((c) => c.id === params.id);

    if (!client) {
        return new Response("Not Found", { status: 404 });
    }

    return Response.json(client);
}