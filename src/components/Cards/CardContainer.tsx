 

import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  bg?: string;
}

const CardContainer = ({ bg, children }: Props) => {
  return (
    <div
      className="rounded-3xl p-4 aspect-card2"
      style={{
        background: `url(${bg}) no-repeat`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      {children}
    </div>
  );
};

export default CardContainer;
