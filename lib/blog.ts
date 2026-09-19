// The blog barrel and its type. Three posts carried over from the old site by title only: the
// bodies are rewritten against the claims gate before any of them publishes, which is why every
// leaf is unpublished and empty below the title.
//
// The leaves import BlogPost from here with `import type`, which TypeScript erases, so the
// import graph has no runtime edge back into this file and no cycle.

import burstPipe from "../content/blog/what-to-do-burst-pipe";
import drainsKeepBlocking from "../content/blog/why-drains-keep-blocking";
import hiddenLeak from "../content/blog/signs-of-hidden-leak";

export interface BlogPost {
  slug: string;
  /** false keeps the post out of routing, the blog index and the sitemap. */
  published: boolean;
  title: string;
  excerpt: string;
  /** ISO date, the day the post was written. */
  date: string;
  readingTime: string;
  body: { h: string; p: string }[];
}

const POST_LEAVES: Readonly<Record<string, BlogPost>> = {
  "what-to-do-burst-pipe": burstPipe,
  "why-drains-keep-blocking": drainsKeepBlocking,
  "signs-of-hidden-leak": hiddenLeak,
};

export const BLOG_POSTS: readonly BlogPost[] = Object.values(POST_LEAVES);

export const PUBLISHED_POSTS: readonly BlogPost[] = BLOG_POSTS.filter((post) => post.published);

export const POST_BY_SLUG: Readonly<Record<string, BlogPost>> = POST_LEAVES;

export function blogHref(slug: string): string {
  return `/blog/${slug}`;
}

for (const [key, post] of Object.entries(POST_LEAVES)) {
  if (post.slug !== key) {
    throw new Error(`lib/blog.ts: leaf content/blog/${key}.ts declares slug "${post.slug}"`);
  }
  if (!post.title.trim()) throw new Error(`lib/blog.ts: ${key} has no title`);
  if (!post.published) continue;
  if (!post.excerpt.trim()) throw new Error(`lib/blog.ts: ${key} is published with no excerpt`);
  if (!post.date.trim()) throw new Error(`lib/blog.ts: ${key} is published with no date`);
  if (post.body.length === 0) throw new Error(`lib/blog.ts: ${key} is published with no body`);
}
