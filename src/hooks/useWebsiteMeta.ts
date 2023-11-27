/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useEffect, useState } from "react";

import { addHttpsPrefix } from "@/utils";
import { getWebsiteMeta } from "@/api/did";

interface UseWebsiteMeta {
  fetched: boolean;
  url?: string;
  origin?: string;
  title?: string;
  icon?: string;
}

export function useWebsiteMeta(value: string): UseWebsiteMeta {
  const [state, setState] = useState<UseWebsiteMeta>({
    fetched: false,
  });

  useEffect(() => {
    const str = addHttpsPrefix(value);

    if (str) {
      const url = new URL(str);

      getWebsiteMeta({ url: encodeURIComponent(url.href) })
        .then((data) => {
          if (data.code === 200) {
            const title: string | undefined = data.data?.title;
            const favicon: string | undefined = data.data?.favicon;

            setState({
              fetched: true,
              url: url.href,
              title: title || url.hostname,
              origin: url.origin,
              icon: favicon,
            });
          } else {
            throw new Error(data.msg);
          }
        })
        .catch(() => {
          setState({
            fetched: true,
            url: url.href,
            title: url.hostname,
            origin: url.origin,
          });
        });
    }
  }, [value]);

  return state;
}
