// ponytail: mock lesson generator — already client-side AI via WebLLM exists,
// this is a server-side fallback for the lesson generator page.
// Add topic templates or connect to an API when content needs to scale.
export async function onRequest(context) {
  const { request } = context;
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const { topic, level } = await request.json();
    const t = topic || 'Programming';
    const l = level || 'beginner';
    const lessons = {
      javascript: {
        title: `JavaScript — ${l} Level`,
        content: `## ${t}\n\nJavaScript is a programming language for the web.\n\n### Key Concepts\n- Variables & Data Types\n- Functions & Scope\n- DOM Manipulation\n\n### Practice\nTry building a simple interactive webpage using ${t}.`
      },
      python: {
        title: `Python — ${l} Level`,
        content: `## ${t}\n\nPython is a versatile language great for beginners.\n\n### Key Concepts\n- Variables & Control Flow\n- Functions & Modules\n- Data Structures\n\n### Practice\nWrite a Python script that reads a file and processes its contents.`
      }
    };
    const key = t.toLowerCase().includes('python') ? 'python' : 'javascript';
    const data = lessons[key];
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
