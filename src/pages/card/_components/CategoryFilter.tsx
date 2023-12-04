// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, memo } from "react";
import { ActionModal } from "@/components";
import IconFilter from "@/assets/img/icon_filter.svg?react";
import { CARD_TYPE, categoryMap } from "@/components";
import { useToggle } from "@/hooks";

const CategoryFilter = ({
  onChange,
  issuers,
}: {
  onChange: (cate: CARD_TYPE | number, issuer: string) => void;
  issuers?: string[];
}) => {
  const [open, toggle] = useToggle();
  const [selectIndex, setSelect] = useState<CARD_TYPE | number>(-1);
  const [selectIssuer, setIssuer] = useState<string>("0x");

  const onConfirm = () => {
    onChange(selectIndex, selectIssuer);

    toggle();
  };

  const onReset = () => {
    setSelect(-1);
    setIssuer("0x");

    console.log(11, selectIndex, selectIssuer);
    setTimeout(() => {
      console.log(22, selectIndex, selectIssuer);
      onConfirm();
    }, 1000);
  };

  return (
    <>
      <button className="btn bg-white" onClick={toggle}>
        <IconFilter />
      </button>
      <ActionModal onClose={toggle} open={open} title="Filters">
        <div className="font-semibold mt-4">Category</div>
        <div className="my-4">
          {Object.keys(categoryMap).map((k) => {
            const index = Number(k) as CARD_TYPE;

            return (
              <span
                className={`btn btn-outline border-grey m-1${
                  selectIndex === index ? " border-primary" : ""
                }`}
                key={k}
                onClick={() => setSelect(selectIndex === index ? -1 : index)}
              >
                {categoryMap[index]}
              </span>
            );
          })}
        </div>
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
                      setIssuer(selectIssuer === issuer ? "0x" : issuer)
                    }
                  >
                    {issuer}
                  </span>
                );
              })}
            </div>
          </>
        ) : null}
        <div className="flex items-center gap-4 mt-4">
          <button className="btn flex-1" onClick={onReset}>
            Reset
          </button>
          <button className="btn btn-primary flex-1" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </ActionModal>
    </>
  );
};

const MemoComponent = memo(CategoryFilter);
export default MemoComponent;
