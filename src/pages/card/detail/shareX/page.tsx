// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isHex } from "@polkadot/util";
import { saveAs } from "file-saver";
import moment from "moment";
import { useCallback, useContext, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import IconSave from "../../_assets/icon_save.svg?react";
import LogoGraphics from "../../_assets/logo_graphics.svg?react";
import LogoWord from "../../_assets/logo_word.svg?react";
import LogoX from "../../_assets/logo_x.svg?react";
import CardBg from "../../_assets/share_card.svg";

import {
  ActionModal,
  BaseCard,
  cardServerImage,
  categoryMap,
  QRCodeGenerator,
} from "@/components";
import {
  useCredential,
  useDecryptedCredential,
  useToggle,
  useVcTemplate,
} from "@/hooks";
import { AppContext } from "@/context/AppProvider";
import { generateImage } from "@/api/tweet";

function XDialog({ open, toggle }: { open: boolean; toggle: () => void }) {
  const retweet = useCallback(() => {
    const search = new URLSearchParams();

    search.append(
      "text",
      "🌟 Just unlocked a new zkID card on zCloak Network! 🏆 Showcasing my #identity in #web3. Check it out! #zCloak"
    );
    window.open(`https://twitter.com/intent/tweet?${search.toString()}`);

    toggle();
  }, [toggle]);

  return (
    <ActionModal onClose={toggle} open={open}>
      <div className="text-semibold text-center">Share Tweet</div>
      <div className="my-4 text-center">
        <div className="rounded flex m-auto bg-[#000] h-[50px] w-[50px] items-center justify-center">
          <LogoX className="text-white w-6" />
        </div>
      </div>
      <div className="flex mb-4 gap-2">
        <button className="flex-1 btn" onClick={toggle}>
          Cancel
        </button>
        <button className="flex-1 btn btn-primary" onClick={retweet}>
          Share Tweet
        </button>
      </div>
    </ActionModal>
  );
}

const ShareX = () => {
  const { id } = useParams();
  const { keyring } = useContext(AppContext);
  const [template] = useVcTemplate(id);
  const credential = useCredential(id);
  const vc = useDecryptedCredential(credential, keyring.password || undefined);
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, toggle] = useToggle();
  const [loading, toggleLoading] = useToggle();

  const { Name, Role } = useMemo(() => {
    if (isHex(vc?.credentialSubject) || !vc?.credentialSubject) {
      return {
        Name: "Name",
        Role: "Role",
      };
    } else {
      return {
        Name: vc.credentialSubject.Name,
        Role: vc.credentialSubject.Role,
      };
    }
  }, [vc?.credentialSubject]);

  const downloadImage = useCallback(() => {
    if (!vc || !template) return;

    toggleLoading();

    type originDataKeys =
      | "category"
      | "issuer"
      | "expiredTime"
      | "background"
      | "title"
      | "logo"
      | "color"
      | "Role"
      | "Name";

    const originData: Record<originDataKeys, unknown> = {
      category: categoryMap[template.category],
      issuer:
        typeof vc?.issuer === "string"
          ? `${vc?.issuer.slice(0, 10)}...${vc?.issuer.slice(-4)}`
          : "--",
      expiredTime: moment(vc?.expirationDate).format("YYYY-MM-DD"),
      background: template?.background
        ? template.background
        : cardServerImage[template.category],
      title: template?.title,
      logo: template?.logo,
      color: template?.color ?? "#FFF",
      Role,
      Name,
    };

    const data = Object.keys(originData)
      .filter(
        (key) =>
          originData[key as originDataKeys] !== undefined &&
          originData[key as originDataKeys] !== null
      )
      .reduce((p, c) => ({ ...p, [c]: originData[c as originDataKeys] }), {});

    void generateImage({
      template: "share_card",
      data,
      width: 342,
      height: 430,
      imageElement: "main",
    }).then((blob) => {
      console.log(blob);
      try {
        saveAs(blob, "card.png");
      } catch (e) {
        console.error(e);
      }
      toggleLoading();
      toggle();
    });
  }, [template, vc, toggle, toggleLoading, Role, Name]);

  return (
    <div className="bg-[#000] h-[100vh] -mx-4">
      <div className="pt-8" ref={cardRef}>
        <div
          className="bg-contain bg-no-repeat m-auto h-[450px] p-[32px] w-[340px]"
          style={{
            backgroundImage: `url(${CardBg})`,
          }}
        >
          <div className="mb-4">
            <LogoWord className="mx-auto text-[#5e6b7e] w-[100px]" />
          </div>
          <div className="border bg-[rgba(0, border-[rgba(0, rounded-[26px] p-3 0, 0.2] 0.1 ">
            <BaseCard id={id} template={template} vc={vc} />
          </div>
          <div className="flex mt-12 items-center justify-between">
            <LogoGraphics style={{ fontSize: 36 }} />
            <div className="-mx-8 text-white scale-[80%]">
              <div className="font-bold">Hey~</div>
              <div className="font-medium text-xs ">
                Scan to unlock your zkID Card!
              </div>
            </div>
            <QRCodeGenerator
              cellSize={2}
              margin={4}
              data="https://wallet.zkid.app"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <button
          className={
            "btn btn-circle border-none" +
            (loading ? " btn-disabled" : " bg-[#333333]")
          }
          disabled={loading}
          onClick={downloadImage}
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <IconSave />
          )}
        </button>
        <div className="mt-2 mb-6 text-[#A5A5A5]">Save to Album</div>
        {/* <Link className="btn btn-ghost" to={`/card/${id}`}>
          <IconClose style={{ fontSize: 32 }} />
        </Link> */}
        {open && <XDialog open={open} toggle={toggle} />}
      </div>
    </div>
  );
};

export default ShareX;
