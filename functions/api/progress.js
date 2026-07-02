// ponytail: single function for all progress ops
export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB;

  try {
    // GET /api/progress?token=xxx&userId=yyy
    if (request.method === 'GET') {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      if (!userId) return json({ error: 'userId required' }, 400);

      const completed = await db.prepare(
        'SELECT challenge_id, completed_at FROM progress WHERE user_id = ? ORDER BY completed_at DESC'
      ).bind(userId).all();

      const badges = await db.prepare(
        'SELECT badge_type, earned_at FROM badges WHERE user_id = ?'
      ).bind(userId).all();

      return json({ completed: completed.results, badges: badges.results });
    }

    // POST /api/progress
    if (request.method === 'POST') {
      const { userId, challengeId, title } = await request.json();
      if (!userId || !challengeId) return json({ error: 'userId and challengeId required' }, 400);

      // Check if already completed
      const existing = await db.prepare(
        'SELECT id FROM progress WHERE user_id = ? AND challenge_id = ?'
      ).bind(userId, challengeId).first();

      if (existing) return json({ status: 'already_completed' });

      // Save progress
      const id = crypto.randomUUID();
      await db.prepare(
        'INSERT INTO progress (id, user_id, challenge_id) VALUES (?, ?, ?)'
      ).bind(id, userId, challengeId).run();

      // Award XP (10 per challenge)
      const xpGain = 10;
      await db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').bind(xpGain, userId).run();

      // Check level up (every 100 XP = 1 level)
      const user = await db.prepare('SELECT xp, level FROM users WHERE id = ?').bind(userId).first();
      const newLevel = Math.floor(user.xp / 100) + 1;
      let leveledUp = false;
      if (newLevel > user.level) {
        await db.prepare('UPDATE users SET level = ? WHERE id = ?').bind(newLevel, userId).run();
        leveledUp = true;
      }

      // Check badges
      const completedCount = await db.prepare(
        'SELECT COUNT(*) as count FROM progress WHERE user_id = ?'
      ).bind(userId).first();
      const newBadges = [];

      if (completedCount.count === 1) {
        await addBadge(db, userId, 'first_challenge');
        newBadges.push('first_challenge');
      }
      if (completedCount.count === 10) {
        await addBadge(db, userId, '10_challenges');
        newBadges.push('10_challenges');
      }
      if (completedCount.count === 50) {
        await addBadge(db, userId, '50_challenges');
        newBadges.push('50_challenges');
      }

      return json({
        status: 'ok',
        xpGained: xpGain,
        totalXp: user.xp + xpGain,
        level: leveledUp ? newLevel : user.level,
        leveledUp,
        newBadges
      });
    }

    return json({ error: 'Method not allowed' }, 405);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

async function addBadge(db, userId, type) {
  const id = crypto.randomUUID();
  await db.prepare('INSERT INTO badges (id, user_id, badge_type) VALUES (?, ?, ?)').bind(id, userId, type).run();
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
