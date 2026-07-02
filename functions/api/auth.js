// ponytail: SHA-256 for password hashing in Workers (no deps)
// Upgrade to bcrypt when handling real user data at scale.
export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { action, email, password, token } = await request.json();
    const db = env.DB;

    if (action === 'register') {
      if (!email || !password) return json({ error: 'email and password required' }, 400);
      const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
      if (existing) return json({ error: 'email already registered' }, 409);

      const id = crypto.randomUUID();
      const hash = await hashPassword(password);
      await db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(id, email, hash).run();
      const sessionToken = crypto.randomUUID();
      return json({ token: sessionToken, user: { id, email, xp: 0, level: 1, streak: 0 } });
    }

    if (action === 'login') {
      if (!email || !password) return json({ error: 'email and password required' }, 400);
      const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
      if (!user) return json({ error: 'invalid credentials' }, 401);

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) return json({ error: 'invalid credentials' }, 401);

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const lastActive = user.last_active;
      let streak = user.streak || 0;
      if (lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        streak = lastActive === yesterday ? streak + 1 : 1;
        await db.prepare('UPDATE users SET streak = ?, last_active = ? WHERE id = ?').bind(streak, today, user.id).run();
      }

      const sessionToken = crypto.randomUUID();
      return json({ token: sessionToken, user: { id: user.id, email: user.email, xp: user.xp, level: user.level, streak, name: user.name || '' } });
    }

    if (action === 'me') {
      if (!token) return json({ error: 'token required' }, 401);
      const user = await db.prepare('SELECT id, email, xp, level, streak, name FROM users WHERE id = ?').bind(token).first();
      if (!user) return json({ error: 'invalid token' }, 401);
      return json({ user });
    }

    return json({ error: 'unknown action' }, 400);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function hashPassword(password) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(password + 'fcc-salt'));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hash) {
  return (await hashPassword(password)) === hash;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
