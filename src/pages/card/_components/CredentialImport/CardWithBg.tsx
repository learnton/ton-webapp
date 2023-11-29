// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from "react";

import IconEdit from "@/assets/icon_edit.svg?react";
import LogoZcloakVc from "@/assets/logo_zcloak_vc.svg?react";
import { AccountName, CardBgConfig, cardImage } from "@/components";
import { useTemplate } from "@/hooks";

const CardWithBg = ({
  alias,
  attester,
  bg,
  bgConfig,
  setBg,
  templateId,
}: {
  bgConfig: CardBgConfig[];
  attester: string;
  templateId?: number;
  bg: string;
  setBg: (bg: string) => void;
  alias?: string;
}) => {
  const [cardBgs, setCardBg] = useState(bgConfig);
  const [template] = useTemplate(templateId);

  const showBg = useCallback(() => {
    setCardBg((c) =>
      c.map((item) => {
        if (item.bgId !== "1") {
          item.show = !item.show;

          return item;
        }

        return item;
      })
    );
  }, []);

  const _bg = useMemo(() => {
    return template
      ? template.background
        ? template.background
        : cardImage[template.category]
      : bg;
  }, [bg, template]);

  return (
    <div
      className="bg-cover rounded-[20px] h-[123px] pt-[28px] pb-[28px] pl-[24px] relative "
      style={{
        backgroundImage: `url(${_bg})`,
        color: template?.color || "#fff",
      }}
    >
      {!template && (
        <div className="bg-white flex flex-row-reverse rounded-[21px] h-[36px] shadow -top-[18px] right-0 absolute items-center">
          {cardBgs.map((item, index) => {
            if (item.bgId === "1") {
              return (
                <button className="bg-[#000] btn" key={index} onClick={showBg}>
                  <IconEdit className="h-[14px] text-white w-[14px]" />
                </button>
              );
            }

            return (
              <div key={index}>
                <button className="btn" onClick={() => setBg(item.bg)}>
                  {item.component as React.ReactElement}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 items-center">
        <LogoZcloakVc />
        <div>
          <div>{alias}</div>
          <div className="text-xs">Attested by</div>
          <AccountName showVid value={attester} />
        </div>
      </div>
    </div>
  );
};

export default CardWithBg;
