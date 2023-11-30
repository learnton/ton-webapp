import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  bg?: string;
}

const CardContainer = ({ bg, children }: Props) => {
  return (
    <div
      className="rounded-3xl p-4 aspect-card2 bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {children}
    </div>
  );
};

export default CardContainer;
