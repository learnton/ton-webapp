// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar } from "@/components";
import { isHex } from "@polkadot/util";
import { useMemo } from "react";

import IconQr from "@/assets/img/icon_qr.svg?react";
import { isDidUrlArray } from "@/utils";

import AccountName from "../AccountName";
import CardContainer from "./CardContainer";
import { ZkIDCardProps } from "./types";

import cardBg from "./assets/card/img_card_1.png";
import DataItem from "./DataItem";

const MembershipCard = ({ handleQr, onClick, template, vc }: ZkIDCardProps) => {
  const { name, role } = useMemo(() => {
    if (isHex(vc?.credentialSubject) || !vc?.credentialSubject) {
      return {
        name: "Name",
        role: "Role",
      };
    } else {
      return {
        name: vc.credentialSubject.Name,
        role: vc.credentialSubject.Role,
      };
    }
  }, [vc?.credentialSubject]);

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
        className="flex flex-col h-full justify-between 'MembershipCard'] after:text-[0]"
        onClick={onClick}
        style={{
          color: template?.color ?? "#FFF",
        }}
      >
        <div className="flex justify-between">
          <span>MEMBERSHIP</span>
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
        <div className="text-center">
          <div className="font-semibold text-xl">{name}</div>
          <div>{role}</div>
        </div>
        <div className="flex mt-4 gap-2 items-center">
          {template?.logo && <Avatar src={template?.logo} />}
          <DataItem
            label="ISSUER"
            value={<AccountName showVid value={attester} />}
          />
        </div>
      </div>
    </CardContainer>
  );
};

export default MembershipCard;
