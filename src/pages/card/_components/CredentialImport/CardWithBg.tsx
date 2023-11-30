// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useState } from "react";

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
  const [template] = useTemplate(templateId);
  const [showCardBgs, setShowCardBgs] = useState(false);

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
        <div className="bg-white flex flex-row-reverse rounded-3xl shadow -top-[20px] right-0 absolute items-center gap-2 p-2">
          {bgConfig.map((item, index) => {
            if (item.bgId === "1") {
              return (
                <div
                  className="bg-[#000] rounded-full w-8 h-8 flex items-center justify-center"
                  key={index}
                  onClick={() => setShowCardBgs(!showCardBgs)}
                >
                  <IconEdit className=" text-white" />
                </div>
              );
            }

            return showCardBgs ? (
              <div key={index} className="avatar">
                <div
                  className="rounded-full w-8 h-8"
                  onClick={() => setBg(item.bg)}
                >
                  <img src={item.bg} alt="" />
                </div>
              </div>
            ) : null;
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
