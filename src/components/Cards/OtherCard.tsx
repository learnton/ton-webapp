/* eslint-disable react-refresh/only-export-components */

import moment from "moment";
import React, { useMemo } from "react";

import IconQr from "@/assets/img/icon_qr.svg?react";
import { isDidUrlArray } from "@/utils";

import AccountName from "../AccountName";
import CardContainer from "./CardContainer";
import { categoryMap, isCategory } from "./categories";
import { ZkIDCardProps } from "./types";

import cardBg from "./assets/card/img_card_3.png";

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs">{label}</span>
      {value}
    </div>
  );
}

const OtherCard: React.FC<ZkIDCardProps> = ({
  handleQr,
  onClick,
  template,
  vc,
}) => {
  const { category, expirationTime } = useMemo(() => {
    return template
      ? {
          expirationTime: moment(
            template.createdTime + template.duration
          ).format("YYYY-MM-DD"),
          category: template.category,
        }
      : {};
  }, [template]);

  const bg = useMemo(
    () => template?.background ?? cardBg,
    [template?.background]
  );

  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return isDidUrlArray(vc?.issuer) ? vc?.issuer[0] : vc?.issuer;
  }, [vc?.issuer]);

  return (
    <CardContainer bg={bg}>
      <div
        className="after:content-['OtherCard'] after:text-[0] h-full flex flex-col justify-between"
        onClick={onClick}
        style={{
          color: template?.color,
        }}
      >
        <div className="flex items-center justify-between">
          <span>{isCategory(category) && categoryMap[category]}</span>
          {handleQr && (
            <button className="btn" onClick={handleQr}>
              <IconQr />
            </button>
          )}
        </div>
        <div className="tooltip" data-tip={template?.title}>
          <span className="mb-4 text-xl">{template?.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <Item
            label="ISSUER"
            value={<AccountName showVid value={attester} />}
          />
          <Item label="EXPIRE DATE" value={expirationTime} />
        </div>
      </div>
    </CardContainer>
  );
};

export default React.memo(OtherCard);
