/* eslint-disable react/prop-types */

import { findCard } from "./findCard";
import OldCard from "./OldCard";
import { ZkIDCardProps } from "./types";

interface Props {
  isOpen?: boolean;
}

export const BaseCard: React.FC<ZkIDCardProps & Props> = ({
  handleQr,
  id,
  onClick,
  template,
  vc,
}) => {
  const Card =
    typeof template?.category === "number"
      ? findCard(template?.category)
      : OldCard;

  return (
    <Card
      handleQr={handleQr}
      id={id}
      onClick={onClick}
      template={template}
      vc={vc}
    />
  );
};
