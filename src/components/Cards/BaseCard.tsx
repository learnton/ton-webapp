// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { memo } from 'react';

import { findCard } from './findCard';
import OldCard from './OldCard';
import { ZkIDCardProps } from './types';

interface Props {
  isOpen?: boolean;
}

const BasicCard: React.FC<ZkIDCardProps & Props> = ({ handleQr, id, onClick, template, vc }) => {
  const Card = typeof template?.category === 'number' ? findCard(template?.category) : OldCard;

  return <Card handleQr={handleQr} id={id} onClick={onClick} template={template} vc={vc} />;
};

export default memo(BasicCard);
