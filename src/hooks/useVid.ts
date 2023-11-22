import { useEffect, useState } from "react";

import { DidUrl } from "@zcloak/did-resolver/types";

import { validName } from "@/api/valid";

export function useVid(did?: DidUrl | null) {
  const [vid, setVid] = useState<string>();

  useEffect(() => {
    if (!did) return;

    validName({ did }).then((res) => setVid(res.data));
  }, [did]);

  return { vid };
}
