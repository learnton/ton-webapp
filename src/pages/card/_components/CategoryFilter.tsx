// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState, memo } from "react";
import { ActionModal } from "@/components";
import IconFilter from "@/assets/img/icon_filter.svg?react";
import { CARD_TYPE, categoryMap } from "@/components";
import { useToggle } from "@/hooks";

interface Props {
  onCateChange: (cate?: CARD_TYPE) => void;
}

const CategoryFilter = ({ onCateChange }: Props) => {
  const [open, toggle] = useToggle();
  const [selectIndex, setSelect] = useState<CARD_TYPE>();

  const onConfirm = useCallback(() => {
    onCateChange(selectIndex);

    toggle();
  }, [onCateChange, toggle, selectIndex]);

  const onReset = useCallback(() => {
    setSelect(undefined);
    onCateChange(undefined);
    toggle();
  }, [onCateChange, toggle]);

  return (
    <>
      <button className="btn btn-ghost" onClick={toggle}>
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
                onClick={() => setSelect(index)}
              >
                {categoryMap[index]}
              </span>
            );
          })}
        </div>
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