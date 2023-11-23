// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from "react";
import { ActionModal } from "@/components";
import IconFilter from "@/assets/img/icon_filter.svg?react";
import { CARD_TYPE, categoryMap } from "@/components";
import { useToggle } from "@/hooks";

interface Props {
  onCateChange: (cate?: CARD_TYPE) => void;
}

const CategoryFilter: React.FC<Props> = ({ onCateChange }) => {
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
      <button className="btn bg-white btn-sm" onClick={toggle}>
        <IconFilter />
      </button>
      {open && (
        <ActionModal onClose={toggle} open={open}>
          <h5 className="text-center font-semibold">Filter Cards</h5>
          <div className="flex items-center mt-2 gap-2">Category</div>
          <div className="flex gap-2 justify-start my-4">
            {Object.keys(categoryMap).map((k) => {
              const index = Number(k) as CARD_TYPE;

              return (
                <span
                  className="badge badge-primary mr-2"
                  key={k}
                  onClick={() => setSelect(index)}
                >
                  {categoryMap[index]}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <button className="btn flex-1" onClick={onReset}>
              Reset
            </button>
            <button className="btn btn-primary flex-1" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </ActionModal>
      )}
    </>
  );
};

export default CategoryFilter;
