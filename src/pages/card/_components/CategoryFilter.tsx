/* eslint-disable react-refresh/only-export-components */

import { useState, memo } from "react";
import { ActionModal } from "@/components";
import IconFilter from "@/assets/img/icon_filter.svg?react";
import { CARD_TYPE, categoryMap, Address } from "@/components";
import { useToggle } from "@/hooks";
import { DidUrl } from "@zcloak/did-resolver/types";

export const DEFAULT_TYPE = -1;
export const DEFAULT_ISSUER = "0x";

const CategoryFilter = ({
  onChange,
  issuers,
  categories,
}: {
  onChange: (cate: CARD_TYPE | -1, issuer: DidUrl | "0x") => void;
  issuers?: DidUrl[];
  categories?: CARD_TYPE[];
}) => {
  const [open, toggle] = useToggle();
  const [selectIndex, setSelect] = useState<CARD_TYPE | -1>(DEFAULT_TYPE);
  const [selectIssuer, setIssuer] = useState<DidUrl | "0x">(DEFAULT_ISSUER);

  const onConfirm = () => {
    onChange(selectIndex, selectIssuer);

    toggle();
  };

  const onReset = () => {
    setSelect(DEFAULT_TYPE);
    setIssuer(DEFAULT_ISSUER);

    onChange(DEFAULT_TYPE, DEFAULT_ISSUER);
    toggle();
  };

  return (
    <>
      <button className="bg-white btn" onClick={toggle}>
        <IconFilter />
      </button>
      <ActionModal onClose={toggle} open={open} title="Filters">
        {Array.isArray(categories) && categories.length > 0 ? (
          <>
            <div className="font-semibold mt-4">Category</div>
            <div className="my-4">
              {categories.map((k) => {
                const index = Number(k) as CARD_TYPE;

                return (
                  <span
                    className={`btn btn-outline border-grey m-1${
                      selectIndex === index ? " border-primary" : ""
                    }`}
                    key={k}
                    onClick={() =>
                      setSelect(selectIndex === index ? DEFAULT_TYPE : index)
                    }
                  >
                    {categoryMap[index]}
                  </span>
                );
              })}
            </div>
          </>
        ) : null}

        {Array.isArray(issuers) ? (
          <>
            <div className="font-semibold mt-4">Issuer</div>
            <div className="my-4">
              {issuers.map((issuer) => {
                return (
                  <span
                    className={`btn btn-outline border-grey m-1${
                      selectIssuer === issuer ? " border-primary" : ""
                    }`}
                    key={issuer}
                    onClick={() =>
                      setIssuer(
                        selectIssuer === issuer ? DEFAULT_ISSUER : issuer
                      )
                    }
                  >
                    <Address value={issuer} />
                  </span>
                );
              })}
            </div>
          </>
        ) : null}
        <div className="flex mt-4 gap-4 items-center">
          <button className="flex-1 btn" onClick={onReset}>
            Reset
          </button>
          <button className="flex-1 btn btn-primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </ActionModal>
    </>
  );
};

const MemoComponent = memo(CategoryFilter);
export default MemoComponent;
