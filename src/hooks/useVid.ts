import { useEffect, useState } from "react";

import { DidUrl } from "@zcloak/did-resolver/types";

import { validName } from "@/api/valid";

export function useVid(did?: DidUrl | null) {
  const [vid, setVid] = useState<string>();

  useEffect(() => {
    if (!did) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void validName({ did }).then((res) => setVid(res.data));
  }, [did]);

  return { vid };
}
