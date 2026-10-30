"use client";

import { useState, type ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// Chakra styles components with Emotion, which by default writes <style> tags
// inline next to the components during server rendering. React doesn't expect
// those tags when it hydrates, so it reports a mismatch. This registry records
// the styles Emotion generates and hands them to Next via useServerInsertedHTML,
// which places them ahead of the content instead.
export function EmotionRegistry({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;

    let inserted: { name: string; isGlobal: boolean }[] = [];
    const insert = cache.insert;
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }
      return insert(...args);
    };

    const flush = () => {
      const flushed = inserted;
      inserted = [];
      return flushed;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const inserted = flush();
    if (inserted.length === 0) {
      return null;
    }

    const globals: { name: string; css: string }[] = [];
    let styles = "";
    let names = cache.key;

    for (const { name, isGlobal } of inserted) {
      const css = cache.inserted[name];
      if (typeof css !== "string") {
        continue;
      }
      if (isGlobal) {
        globals.push({ name, css });
      } else {
        styles += css;
        names += ` ${name}`;
      }
    }

    return (
      <>
        {globals.map(({ name, css }) => (
          <style key={name} data-emotion={`${cache.key}-global ${name}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
        {styles && <style data-emotion={names} dangerouslySetInnerHTML={{ __html: styles }} />}
      </>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
