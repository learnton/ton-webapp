// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isHex } from "@polkadot/util";
import moment from "moment";
import { useContext, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { isDidUrl } from "@zcloak/did";
import {
  useCredential,
  useCtype,
  useDecryptedCredential,
  useVcTemplate,
  useWebsiteMeta,
} from "@/hooks";
import CredentialCard from "../_components/CredentialCard";
import { AppContext } from "@/context/AppProvider";
import {
  Avatar,
  AccountName,
  ApplicationProps,
  categoryMap,
  ClaimContent,
} from "@/components";

import Operation from "../_components/Operation";

export function ItemWrapper(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-[#F6F6F6] rounded-lg min-h-[42px] p-2" +
        (props.className ? " " + props.className : "")
      }
    >
      {props.children}
    </div>
  );
}

export function Label({ label }: { label: string }) {
  return <div className="text-text2 text-sm m-2">{label}</div>;
}

function InfoItem({
  label,
  value,
}: {
  label?: string;
  value?: string | number;
}) {
  return (
    <div className="text-sm font-rubik flex items-center justify-between p-2">
      <div className="text-text2">{label}</div>
      <div>
        {isDidUrl(value) || isHex(value) ? (
          <AccountName showVid value={value} />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function Application({ app }: { app: ApplicationProps }) {
  const meta = useWebsiteMeta(app.url);

  return (
    <ItemWrapper className="flex items-center">
      {meta.icon && <Avatar src={meta.icon} />}
      <div className="ml-2">{app.title}</div>
    </ItemWrapper>
  );
}

const CredentialsDetails = () => {
  const { keyring } = useContext(AppContext);
  const { id } = useParams();
  const credential = useCredential(id);
  const decrypted = useDecryptedCredential(credential, keyring.password);
  const [template] = useVcTemplate(id);
  const ctype = useCtype(decrypted?.ctype);

  // console.log(decrypted, credential, keyring, template);
  const {
    applications,
    category,
    createdTime,
    ctypeHash,
    desc,
    duration,
    id: templateId,
    title,
  } = useMemo(() => {
    return {
      ...template,
      applications: template?.applications,
      category: template?.category,
      createdTime: template?.createdTime,
      ctypeHash: template?.ctypeHash ?? decrypted?.ctype,
      desc: template?.desc ?? ctype?.description,
      issuer: template?.issuer ?? decrypted?.issuer,
      title: template?.title ?? ctype?.title,
    };
  }, [template, decrypted, ctype]);

  const expirationTime = useMemo(() => {
    if (createdTime && duration) {
      return moment(createdTime + duration).format("YYYY-MM-DD");
    }

    if (decrypted?.expirationDate) {
      return moment(decrypted?.expirationDate).format("YYYY-MM-DD");
    }

    return undefined;
  }, [createdTime, duration, decrypted]);

  // TODO v1 to v2 issuer
  const attester = useMemo(() => {
    return credential?.attester?.[0];
  }, [credential?.attester]);

  const tabs = useRef(["Data Fields", "Card Properties"]);
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="leading-loose font-bold text-xl flex-1">Card Details</h1>
        <Operation />
      </div>
      <CredentialCard
        attester={attester}
        ctypeHash={credential?.ctypeHash}
        encoded={credential?.encoded}
        id={credential?.id}
        rootHash={credential?.rootHash}
        showDetails={false}
      />

      <div role="tablist" className="tabs mb-4">
        {tabs.current.map((tab, index) => (
          <a
            key={index}
            role="tab"
            className={
              "tab rounded-xl " +
              (currentTab === index ? "bg-[#0F1511] text-white" : "text-text2")
            }
            onClick={() => {
              setCurrentTab(index);
            }}
          >
            {tab}
          </a>
        ))}
      </div>
      {currentTab === 0 && (
        <>
          <Label label="Data Fields" />
          {decrypted && (
            <ItemWrapper>
              <ClaimContent
                contents={decrypted?.credentialSubject}
                ctype={decrypted?.ctype}
              />
            </ItemWrapper>
          )}
        </>
      )}
      {currentTab === 1 && (
        <>
          <div className="flex flex-col gap-4">
            <div>
              <Label label="TITLE" />
              <ItemWrapper>{title}</ItemWrapper>
            </div>

            <div>
              <Label label="DESCRIPTION" />
              <ItemWrapper>{desc}</ItemWrapper>
            </div>

            <div>
              <Label label="CARD INFO" />

              <ItemWrapper>
                <InfoItem label="TEMPLATE ID" value={templateId} />
                <div className="h-[0px] border-t border-white"></div>
                <InfoItem label="EXPIRE TIME" value={expirationTime} />
                <div className="h-[0px] border-t border-white"></div>
                <InfoItem label="ISSUER" value={attester} />
                <div className="h-[0px] border-t border-white"></div>
                <InfoItem
                  label="CATEGORY"
                  value={category ? categoryMap[category] : ""}
                />
              </ItemWrapper>
            </div>

            <div>
              <Label label="DATA FIELD HASH" />
              <ItemWrapper className="break-all">
                <div>{ctypeHash}</div>
              </ItemWrapper>
            </div>
            {applications && applications.length > 0 && (
              <div>
                <Label label="APPLICATIONS" />
                {applications?.map((item, idx) => {
                  return <Application app={item} key={idx} />;
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CredentialsDetails;
