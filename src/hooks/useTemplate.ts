// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext, useEffect, useMemo, useState } from "react";

import { insertTempIfNot } from "@/pages/message/_utils";
import { getTemplateById, getVcTemplate } from "@/utils";
import { CacheTemplate } from "@/utils";

import { AppContext } from "@/context/AppProvider";
import { useDidDB } from "./useDidDB";

export function useVcTemplate(id?: string) {
  const [template, setTemplate] = useState<CacheTemplate | undefined>(
    undefined
  );
  const { cacheDB } = useContext(AppContext);
  const didDB = useDidDB();

  useEffect(() => {
    if (id && didDB) {
      void getVcTemplate(cacheDB, didDB, id).then(setTemplate);
    }
  }, [didDB, cacheDB, id]);

  return useMemo(() => [template], [template]);
}

export function useTemplate(id?: number) {
  const [template, setTemplate] = useState<CacheTemplate | undefined>(
    undefined
  );
  const { cacheDB } = useContext(AppContext);

  useEffect(() => {
    if (id) {
      void getTemplateById(cacheDB, id).then((template) => {
        void (template
          ? setTemplate(template)
          : insertTempIfNot(cacheDB, id).then(setTemplate));
      });
    }
  }, [cacheDB, id]);

  return useMemo(() => [template], [template]);
}
