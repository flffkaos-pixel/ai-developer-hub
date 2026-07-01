const fs = require('fs');
const path = require('path');

const FCC_DIR = path.resolve(__dirname, '../../freeCodeCamp');
const CURR_DIR = path.join(FCC_DIR, 'curriculum');
const OUT_DIR = path.resolve(__dirname, '../public/data');

function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function extractBlocks(sbData) {
  if (sbData.blocks) return sbData.blocks;
  if (sbData.chapters) {
    return sbData.chapters.flatMap(ch =>
      (ch.modules || []).flatMap(m => m.blocks || [])
    );
  }
  if (sbData.certifications) return []; // skip
  return [];
}

function parseMarkdown(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatter = {};
  frontmatterMatch[1].split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) frontmatter[match[1]] = match[2].replace(/^"(.*)"$/, '$1');
  });

  const body = frontmatterMatch[2];
  const descMatch = body.match(/## --description--\n([\s\S]*?)(?=\n## --)/);
  const instructionsMatch = body.match(/## --instructions--\n([\s\S]*?)(?=\n## --|$)/);
  const testsMatch = body.match(/## --tests--\n([\s\S]*?)(?=\n## --|$)/);
  const seedMatch = body.match(/## --seed--\n([\s\S]*?)(?=\n## --|$)/);

  let description = descMatch ? descMatch[1].trim() : '';
  const instructions = instructionsMatch ? instructionsMatch[1].trim() : '';
  if (instructions) description += '\n\n' + instructions;

  let tests = [];
  if (testsMatch) {
    const testBlocks = testsMatch[1].match(/```(?:js|json)?\n([\s\S]*?)```/g);
    if (testBlocks) {
      tests = testBlocks.map(t => t.replace(/```(?:js|json)?\n?/, '').replace(/```$/, '').trim());
    }
  }

  let seedCode = '';
  if (seedMatch) {
    const seedBlocks = seedMatch[1].match(/```(?:html|js|css|py|jsx)?\n([\s\S]*?)```/g);
    if (seedBlocks) seedCode = seedBlocks.join('\n');
  }

  return { frontmatter, description, tests, seed: seedCode };
}

function build() {
  const curriculum = readJSON(path.join(CURR_DIR, 'structure', 'curriculum.json'));
  const allNames = new Set(curriculum.superblocks);

  // Build lookup: superblock name -> block names
  const superblockBlocks = {};
  for (const sbName of curriculum.superblocks) {
    const sbPath = path.join(CURR_DIR, 'structure', 'superblocks', `${sbName}.json`);
    if (fs.existsSync(sbPath)) {
      superblockBlocks[sbName] = extractBlocks(readJSON(sbPath));
    } else {
      superblockBlocks[sbName] = [];
    }
  }

  // Build all blocks data
  const allBlocks = {};
  const blocksDir = path.join(CURR_DIR, 'structure', 'blocks');
  for (const f of fs.readdirSync(blocksDir)) {
    if (!f.endsWith('.json')) continue;
    const name = f.replace('.json', '');
    const data = readJSON(path.join(blocksDir, f));
    allBlocks[name] = data;
  }

  // Build curriculum
  const superblocks = curriculum.superblocks.map(sbName => {
    const blockNames = superblockBlocks[sbName] || [];
    const blocks = blockNames.filter(b => allBlocks[b]).map(blockName => {
      const blockData = allBlocks[blockName];
      const challenges = (blockData.challengeOrder || []).map(ch => {
        const mdFile = path.join(CURR_DIR, 'challenges', 'english', 'blocks', blockName, `${ch.id}.md`);
        const parsed = parseMarkdown(mdFile);
        return {
          id: ch.id,
          title: ch.title,
          dashedName: parsed?.frontmatter?.dashedName || '',
          description: (parsed?.description || '').slice(0, 1000),
          challengeType: parsed?.frontmatter?.challengeType || '',
          tests: (parsed?.tests || []).slice(0, 3)
        };
      });
      return { name: blockName, challenges };
    });
    return { name: sbName, blocks };
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Write index (lightweight)
  const index = {
    updated: new Date().toISOString(),
    superblocks: superblocks.map(sb => ({
      name: sb.name,
      blocks: sb.blocks.map(b => ({
        name: b.name,
        count: b.challenges.length
      }))
    }))
  };
  fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index));

  // Write individual superblock files
  superblocks.forEach(sb => {
    fs.writeFileSync(
      path.join(OUT_DIR, `sb-${sb.name}.json`),
      JSON.stringify(sb)
    );
  });

  const totalChallenges = superblocks.reduce((a, s) =>
    a + s.blocks.reduce((b, bl) => b + bl.challenges.length, 0), 0
  );
  console.log(`Done: ${superblocks.length} superblocks, ${totalChallenges} challenges`);
  console.log(`Written to ${OUT_DIR}`);
}

build();
