export async function onRequest(context) {
  const { request, env } = context;
  const key = env.IMGBB_KEY;

  if (!key) return json({ error: 'IMGBB_KEY not configured' }, 500);
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { image, name } = await request.json();
  if (!image) return json({ error: 'Missing image data' }, 400);

  const form = new FormData();
  form.append('key', key);
  form.append('image', image);
  if (name) form.append('name', name);

  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form });
  const data = await res.json();
  return json(data, res.status);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
