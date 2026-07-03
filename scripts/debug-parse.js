const fs = require('fs');
const content = fs.readFileSync('C:/Users/중진공39/freeCodeCamp/curriculum/challenges/english/blocks/data-visualization-with-d3/587d7fa6367417b2b2512bc3.md', 'utf8');
const sections = content.split(/^# /m).slice(1);
for (const s of sections) {
  const header = s.split('\n')[0].trim();
  if (header === '--seed--') {
    const body = s.substring(s.indexOf('\n') + 1).trim();
    const regex = /```(\w+)?\n([\s\S]*?)```/;
    const m = body.match(regex);
    if (m) {
      console.log('MATCHED!');
      console.log('Language:', m[1]);
      console.log('Content start:', m[2].substring(0, 50));
    } else {
      console.log('NO MATCH');
      console.log('body length:', body.length);
      console.log('body start:', body.substring(0, 100));
      for (let i = 0; i < body.length; i++) {
        if (body.charCodeAt(i) > 127) {
          console.log('Non-ASCII at', i, ':', body.charCodeAt(i), body[i]);
          break;
        }
      }
    }
  }
}
