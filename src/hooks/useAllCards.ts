import { useEffect, useMemo, useState } from "react";

import { DidUrl } from "@zcloak/did-resolver/types";

import { useCredentials, useCredentialByCate } from "@/hooks";

import { type ZkCredential } from "@/utils";

export function useAllCards(
  category?: number,
  issuer?: DidUrl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  titleOrId?: string
) {
  const results = useCredentials();
  const [data, setData] = useState<ZkCredential[]>([]);
  const [issuers, setIssuers] = useState<DidUrl[]>([]);
  const [categories, setCateGories] = useState<number[]>([]);
  const filterByCategory = useCredentialByCate(category);

  useEffect(() => {
    if (Array.isArray(results)) {
      const cate = new Set<number>();

      // for (const card of results) {
      //   if (card.template?.category !== undefined) {
      //     cate.add(card.template?.category);
      //   }
      // }

      setCateGories([...cate]);
      const uniqueIssuers = new Set<DidUrl>();

      results.forEach((card) => {
        if (Array.isArray(card.attester)) {
          card.attester.forEach((_i) => uniqueIssuers.add(_i));
        } else if (card.attester) {
          uniqueIssuers.add(card.attester);
        }
      });

      setIssuers([...uniqueIssuers]);
    }
  }, [results]);

  const search = () => {
    let _results: ZkCredential[] = [];
    if (Array.isArray(results)) {
      _results = _results.concat(results);
    }

    if (category !== undefined) {
      _results = filterByCategory || [];
    }

    if (issuer) {
      _results = _results.filter((card) => card.attester.includes(issuer));
    }

    setData(_results);
  };

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issuer, category, results, filterByCategory]);

  useEffect(() => {
    if (titleOrId) {
      console.log("titleOrId=", titleOrId);
      // const queryReg = new RegExp(titleOrId, "i");

      // setData((data) => {
      //   return data.filter((item) =>
      //     item.template
      //       ? queryReg.test(item.template?.id.toString()) ||
      //         queryReg.test(item.template.title)
      //       : false
      //   );
      // });
    } else {
      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleOrId]);

  return useMemo(() => {
    return {
      cards: data,
      issuers,
      categories,
      cardsCount: (results || []).length,
    };
  }, [data, issuers, categories, results]);
}
