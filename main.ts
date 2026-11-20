// Entry program for gta6-meme-x-01 (Node 22, standard library only).
// It copies POST.json from the repository root to /output/POST.json, where
// the gate reads the X post's address. That is all the program has to do:
// the entry is the post itself. The house reads the post from X (its first
// picture and its text) and hands that to the AI judge.
//
// Before copying, it validates the link: the url must be a real X post
// address (https://x.com/<handle>/status/<digits>, twitter.com accepted),
// so a placeholder or mistyped link can never be published by mistake.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_URL_RE = /^https:\/\/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)$/;

const postPath = join(BOT_DIR, 'POST.json');
let postUrl;
try {
  postUrl = JSON.parse(readFileSync(postPath, 'utf8')).url;
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${err.message}`);
  process.exit(1);
}
const postMatch = typeof postUrl === 'string' ? POST_URL_RE.exec(postUrl) : null;
if (!postMatch || /^0+$/.test(postMatch[1])) {
  console.error(`Invalid X post link in POST.json: ${JSON.stringify(postUrl)} (expected https://x.com/<handle>/status/<digits>)`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${err.message}`);
  process.exit(1);
}
console.log(`Publishing X post: ${postUrl}`);
