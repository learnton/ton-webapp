// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { updateSvg } from "jdenticon";
import React, { useEffect, useRef } from "react";

interface Props {
  value?: string | null;
  [key: string]: unknown;
}

const IdentityIcon: React.FC<Props> = (props) => {
  const canvasRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      updateSvg(canvas, props.value);
    }
  }, [props.value]);

  return <svg ref={canvasRef} {...props} />;
};

export default IdentityIcon;
