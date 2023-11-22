/* eslint-disable react/prop-types */

import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  bg?: string;
}

const CardContainer: React.FC<Props> = ({ bg, children }) => {
  return (
    <div>
      <div
        className="Card_Content"
        style={{
          background: `url(${bg}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CardContainer;
