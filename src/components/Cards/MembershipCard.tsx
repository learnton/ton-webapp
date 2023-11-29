// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Avatar } from "@/components";
import { isHex } from "@polkadot/util";
import React, { useMemo } from "react";

import IconQr from "@/assets/img/icon_qr.svg?react";
import { isDidUrlArray } from "@/utils";

import AccountName from "../AccountName";
import CardContainer from "./CardContainer";
import { ZkIDCardProps } from "./types";

import cardBg from "./assets/card/img_card_1.png";
import DataItem from "./DataItem";

const MembershipCard: React.FC<ZkIDCardProps> = ({
  handleQr,
  onClick,
  template,
  vc,
}) => {
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
        className="h-full flex flex-col justify-between after:content-['MembershipCard'] after:text-[0]"
        onClick={onClick}
        style={{
          color: template?.color ?? "#FFF",
        }}
      >
        <div className="flex justify-between">
          <span>MEMBERSHIP</span>
          {handleQr && (
            <button
              className="btn btn-circle bg-[rgba(0,0,0,.2)] border-none"
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
          <div className="text-xl font-semibold">{name}</div>
          <div>{role}</div>
        </div>
        <div className="flex items-center mt-4 gap-2">
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
