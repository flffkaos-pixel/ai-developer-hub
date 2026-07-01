// ponytail: browser WebLLM handles AI — this endpoint is a fallback only
// When WebLLM is unavailable (no WebGPU), this returns a canned response.
// Replace with OpenAI/Claude API key when needed.
export async function onRequest(context) {
  const { request } = context;
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const { message } = await request.json();
    return new Response(JSON.stringify({
      reply: `Ask me in the chat above — the AI runs in your browser via WebLLM (no server cost). You said: "${message?.slice(0, 100)}"`
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
