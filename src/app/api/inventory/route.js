
// Using JSONPlaceholder as a free fake REST API for demonstration
const EXTERNAL_API_BASE = "https://jsonplaceholder.typicode.com/posts";

export async function GET() {
  // Proxy GET to external API
  const res = await fetch(EXTERNAL_API_BASE, { method: "GET" });
  const data = await res.json();
  return Response.json(data);
}

export async function POST(req) {
  // Proxy POST to external API
  const body = await req.text();
  const res = await fetch(EXTERNAL_API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json();
  return Response.json(data);
}

export async function DELETE(req) {
  // Proxy DELETE to external API (assuming API expects id in body)
  const body = await req.text();
  const res = await fetch(EXTERNAL_API_BASE, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json();
  return Response.json(data);
}
