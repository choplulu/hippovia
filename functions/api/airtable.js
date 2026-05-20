const BASE_ID = 'appeuwZIOxylFgFJv';

export async function onRequest(context) {
  const { request, env } = context;
  const token = env.AIRTABLE_TOKEN;

  if (!token) {
    return json({ error: 'AIRTABLE_TOKEN not configured' }, 500);
  }

  const url = new URL(request.url);
  const table = url.searchParams.get('table');

  if (!table) {
    return json({ error: 'Missing table parameter' }, 400);
  }

  if (request.method === 'GET') {
    const pageSize = url.searchParams.get('pageSize') || '100';
    const offset = url.searchParams.get('offset') || '';
    const filterByFormula = url.searchParams.get('filterByFormula') || '';
    const sort = url.searchParams.get('sort') || '';

    let airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}?pageSize=${pageSize}`;
    if (offset) airtableUrl += `&offset=${encodeURIComponent(offset)}`;
    if (filterByFormula) airtableUrl += `&filterByFormula=${encodeURIComponent(filterByFormula)}`;
    if (sort) airtableUrl += `&${sort}`;

    const res = await fetch(airtableUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return json(data, res.status);
  }

  if (request.method === 'POST') {
    const body = await request.json();
    const res = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    return json(data, res.status);
  }

  return json({ error: 'Method not allowed' }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
