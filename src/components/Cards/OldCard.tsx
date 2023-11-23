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

const OldCard: React.FC<ZkIDCardProps> = ({ handleQr, id, onClick, vc }) => {
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
        onClick={onClick}
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#FFFFFF",
        }}
      >
        <div className="flex items-center justify-between">
          <span>Legacy</span>
          {handleQr && (
            <button
              className="btn btn-ghost"
              onClick={(e) => {
                e.stopPropagation();
                // handleQr()
              }}
            >
              <IconQr />
            </button>
          )}
        </div>
        <div className="mb-4 text-xl">{ctype?.title}</div>

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

export default React.memo(OldCard);
