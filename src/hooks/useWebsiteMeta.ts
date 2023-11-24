// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";

import { DID_SERVICE } from "@/api/axiosInstance";

import { addHttpsPrefix } from "@/utils";

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

      fetch(
        `${DID_SERVICE}/website_metadata?url=${encodeURIComponent(url.href)}`
      )
        .then((res) => res.json())
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
            throw new Error(data.message);
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
