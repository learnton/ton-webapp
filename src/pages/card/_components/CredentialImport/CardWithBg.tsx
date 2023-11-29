// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from "react";

import IconEdit from "@/assets/icon_edit.svg?react";
import LogoZcloakVc from "@/assets/logo_zcloak_vc.svg?react";
import { AccountName, CardBgConfig, cardImage } from "@/components";
import { useTemplate } from "@/hooks";

const CardWithBg: React.FC<{
  bgConfig: CardBgConfig[];
  attester: string;
  templateId?: number;
  bg: string;
  setBg: (bg: string) => void;
  alias?: string;
}> = ({ alias, attester, bg, bgConfig, setBg, templateId }) => {
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
      className="rounded-[20px] h-[123px] pb-[28px] pl-[24px] pt-[28px] relative bg-cover "
      style={{
        backgroundImage: `url(${_bg})`,
        color: template?.color || "#fff",
      }}
    >
      {!template && (
        <div className="h-[36px] absolute right-0 -top-[18px] bg-white flex flex-row-reverse items-center rounded-[21px] shadow">
          {cardBgs.map((item, index) => {
            if (item.bgId === "1") {
              return (
                <button className="btn bg-[#000]" key={index} onClick={showBg}>
                  <IconEdit className="text-white w-[14px] h-[14px]" />
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

      <div className="flex items-center gap-2">
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
