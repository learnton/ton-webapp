/* eslint-disable react/prop-types */

import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  bg?: string;
}

const CardContainer: React.FC<Props> = ({ bg, children }) => {
  return (
    <div
      className="aspect-card2 rounded-3xl p-4"
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
