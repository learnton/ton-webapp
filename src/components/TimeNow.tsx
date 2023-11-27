// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import { useEffect, useState } from 'react';

function TimeNow(): JSX.Element {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{moment(now).format('YYYY-MM-DD HH:mm:ss')}</>;
}

export default TimeNow;
