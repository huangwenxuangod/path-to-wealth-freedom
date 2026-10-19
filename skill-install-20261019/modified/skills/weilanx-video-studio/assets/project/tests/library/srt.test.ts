import {describe, expect, it} from 'vitest';
// @ts-expect-error untyped mjs
import {parseSrt} from '../../scripts/srt2json.mjs';

describe('parseSrt', () => {
  it('parses index, times in seconds and joins text lines', () => {
    const cues = parseSrt('1\n00:00:00,139 --> 00:00:01,148\n如果你想让普通AI\n\n2\r\n00:01:01,252 --> 00:01:02,157\r\n帮你\r\n整理\r\n');
    expect(cues).toEqual([
      {i: 1, start: 0.139, end: 1.148, text: '如果你想让普通AI'},
      {i: 2, start: 61.252, end: 62.157, text: '帮你整理'},
    ]);
  });
});
