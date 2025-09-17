// In-memory sales store
let sales = [];

export async function POST(req) {
  const { items, total } = await req.json();
  const sale = {
    id: Date.now(),
    items,
    total,
    date: new Date().toISOString(),
  };
  sales.push(sale);
  return Response.json(sale);
}

export async function GET() {
  return Response.json(sales);
}
