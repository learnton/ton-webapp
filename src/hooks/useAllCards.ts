import { useEffect, useMemo, useState } from "react";
import { DidUrl } from "@zcloak/did-resolver/types";
import { useCredentials, useCredentialByCate, useDidDB } from "@/hooks";
import { type ZkCredential, type CardTemplateRelation } from "@/utils";

export function useAllCards(
  category?: number,
  issuer?: DidUrl,
  titleOrId?: string
) {
  const results = useCredentials();
  const [data, setData] = useState<ZkCredential[]>([]);
  const [issuers, setIssuers] = useState<DidUrl[]>([]);
  const [templateRelation, setTemplateRalation] = useState<
    Record<string, CardTemplateRelation>
  >({});
  const filterByCategory = useCredentialByCate(category);
  const didDB = useDidDB();

  useEffect(() => {
    if (Array.isArray(results)) {
      const map: Record<string, CardTemplateRelation> = {};
      if (Array.isArray(results)) {
        for (const card of results) {
          void didDB?.cardTemplateRelation
            .where({ id: card.id })
            .first()
            .then((template) => {
              console.log("template=", template);
              if (template && !map[card.id]) {
                map[card.id] = template;
                setTemplateRalation({ ...map });
              }
            });
        }
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const queryReg = new RegExp(titleOrId, "i");

      setData((data) => {
        return data.filter((item) =>
          templateRelation[item.id]
            ? queryReg.test(templateRelation[item.id]?.id.toString()) ||
              queryReg.test(templateRelation[item.id].title)
            : false
        );
      });
    } else {
      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleOrId]);

  return useMemo(() => {
    return {
      cards: data,
      issuers,
      categories: Object.keys(templateRelation)
        .map((vcid) => templateRelation[vcid].category)
        .filter((c) => !!c),
      cardsCount: (results || []).length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, issuers, results]);
}
