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

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div color="inherit">
      <span color="inherit">{label}</span>
      {value}
    </div>
  );
}

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
    () => template?.background ?? "/static/card/img_card_1.png",
    [template?.background]
  );

  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return isDidUrlArray(vc?.issuer) ? vc?.issuer[0] : vc?.issuer;
  }, [vc?.issuer]);

  return (
    <CardContainer bg={bg}>
      <div
        onClick={onClick}
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: template?.color ?? "#FFF",
        }}
      >
        <div className="flex space-between">
          <span color="inherit">MEMBERSHIP</span>
          {handleQr && (
            <button className="btn" onClick={handleQr}>
              <IconQr />
            </button>
          )}
        </div>
        <div className="text-center">
          <span color="inherit" className="text-xl">
            {name}
          </span>
          <span color="inherit">{role}</span>
        </div>
        <div className="flex items-center mt-4 gap-1">
          {template?.logo && <Avatar src={template?.logo} />}
          <Item
            label="ISSUER"
            value={<AccountName showVid value={attester} />}
          />
        </div>
      </div>
    </CardContainer>
  );
};

export default MembershipCard;
