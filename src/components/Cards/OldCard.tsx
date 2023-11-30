/* eslint-disable react-refresh/only-export-components */

import moment from "moment";
import React, { useMemo } from "react";
import { useCredentialCardBg, useCtype } from "@/hooks";
import IconQr from "@/assets/img/icon_qr.svg?react";
import { isDidUrlArray } from "@/utils";

import AccountName from "../AccountName";
import CardContainer from "./CardContainer";
import { ZkIDCardProps } from "./types";

import DataItem from "./DataItem";

const OldCard = ({ handleQr, id, onClick, vc }: ZkIDCardProps) => {
  const expirationTime = useMemo(() => {
    return vc?.expirationDate
      ? moment(vc.expirationDate).format("YYYY-MM-DD")
      : null;
  }, [vc]);

  const cardBg = useCredentialCardBg(id);

  const ctype = useCtype(vc?.ctype);

  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return isDidUrlArray(vc?.issuer) ? vc?.issuer[0] : vc?.issuer;
  }, [vc?.issuer]);

  return (
    <CardContainer bg={cardBg?.bg}>
      <div
        className="after:content-['OldCard'] after:text-[0] h-full flex flex-col justify-between text-white"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <span>Legacy</span>
          {handleQr && (
            <button
              className="border-none bg-[rgba(0,0,0,.2)] btn btn-circle"
              onClick={(e) => {
                e.stopPropagation();
                handleQr(e);
              }}
            >
              <IconQr className="text-[#fff] scale-[110%]" />
            </button>
          )}
        </div>
        <div className="text-xl mb-4">{ctype?.title}</div>

        <div className="flex justify-between">
          <DataItem
            label="ISSUER"
            value={<AccountName showVid value={attester} />}
          />
          <DataItem label="EXPIRE DATE" value={expirationTime} />
        </div>
      </div>
    </CardContainer>
  );
};

const exportComponent = React.memo(OldCard);

export default exportComponent;
