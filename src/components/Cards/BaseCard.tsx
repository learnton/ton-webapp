 

import { findCard } from "./findCard";
import OldCard from "./OldCard";
import { ZkIDCardProps } from "./types";

interface Props {
  isOpen?: boolean;
}

export const BaseCard = ({
  handleQr,
  id,
  onClick,
  template,
  vc,
}: ZkIDCardProps & Props) => {
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
