import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { removePosition } from 'unist-util-remove-position';
import { remarkMatter } from '@adobe/helix-markdown-support';
import remarkGfm from '../utils/remark-gfm-nolink.js';

export class FrontmatterParsingError extends Error {
}

export default function parseMarkdown(state) {
  const { log, content } = state;

  // convert linebreaks
  const converted = content.data.replace(/(\r\n|\n|\r)/gm, '\n');
  content.mdast = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMatter, {
      errorHandler: (e) => {
        log.warn(new FrontmatterParsingError(e));
      },
    })
    .parse(converted);

  removePosition(content.mdast, true);
}