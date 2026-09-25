export async function GET() {
  return Response.json({ state: null, storage: "browser" });
}

export async function POST(request: Request) {
  const state = await request.json() as { entries?: unknown[] };
  if (!state || !Array.isArray(state.entries)) return Response.json({ error: "invalid_state" }, { status: 400 });
  return Response.json({ saved: false, storage: "browser" });
}
