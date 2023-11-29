// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import saveAs from "file-saver";
import { useCallback, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { VerifiableCredential } from "@zcloak/vc/types";
import IconMore from "../_assets/icon_more.svg?react";
import IconShowProof from "../_assets/icon_show.svg?react";
import { WarpVcWithTemplate } from "@/types";
import { AppContext } from "@/context/AppProvider";
import { useDidDB, useToggle } from "@/hooks";
import { CARD_TYPE, DeleteDialog, ActionModal } from "@/components";

import IconShare from "../_assets/icon_share@2x.png";
import IconBackup from "../_assets/icon_backup@2x.png";
import IconDelete from "../_assets/icon_trash@2x.png";

interface Props {
  credential?: VerifiableCredential<boolean> | null;
  templateId?: CARD_TYPE;
  credentialId?: string;
}

const Operation = ({ credential, credentialId, templateId }: Props) => {
  const [delOpen, toggleDel] = useToggle();
  const { credentialCard } = useContext(AppContext);
  const didDB = useDidDB();
  const navigate = useNavigate();
  const [moreVisible, setMoreVisible] = useState(false);

  const download = useCallback(() => {
    if (!credential) return;

    const warpVc: WarpVcWithTemplate | VerifiableCredential<boolean> =
      templateId
        ? {
            templateId,
            credential,
          }
        : credential;

    const blobSiningJson = new Blob([JSON.stringify(warpVc)], {
      type: "application/json; charset=utf-8",
    });

    setMoreVisible(false);

    saveAs(blobSiningJson, "credential.json");
  }, [credential, templateId]);

  const deleteVc = useCallback(async () => {
    if (credentialId) {
      await didDB?.zkCredential.delete(credentialId);
      await didDB?.cardTemplateRelation.delete(credentialId);
      await credentialCard.delete(credentialId);

      toggleDel();
      navigate(-1);
    }
  }, [didDB, credentialCard, toggleDel, navigate, credentialId]);

  const LiClass =
    "flex flex-row items-center gap-2 border-b border-grey2 last:border-none p-2";

  return (
    <>
      <Link className="text-xs text-center p-2" to="presentation">
        <IconShowProof className="m-auto" />
        <div>Show Proof</div>
      </Link>
      <div
        role="button"
        className="text-xs text-center p-2"
        onClick={() => setMoreVisible(true)}
      >
        <IconMore className="m-auto" />
        <div>More</div>
      </div>

      {/* More Menu */}
      <ActionModal
        closeByModal
        open={moreVisible}
        onClose={() => setMoreVisible(false)}
      >
        <ul className="text-text1">
          {templateId ? (
            <Link className={LiClass} to="share">
              <div className="bg-[#fff7e6] rounded-3xl p-2 text-[0px]">
                <img
                  src={IconShare}
                  alt="Share"
                  className="object-contain h-4 w-4"
                />
              </div>
              Share Card
            </Link>
          ) : null}
          <li className={LiClass} onClick={download}>
            <div className="bg-[#effbf3] rounded-3xl p-2 text-[0px]">
              <img
                src={IconBackup}
                alt="Share"
                className="object-contain h-4 w-4"
              />
            </div>
            Backup Card
          </li>
          <li
            className={LiClass}
            onClick={() => {
              setMoreVisible(false);
              toggleDel();
            }}
          >
            <div className="bg-[#fff3f3] rounded-3xl p-2 text-[0px]">
              <img
                src={IconDelete}
                alt="Share"
                className="object-contain h-4 w-4"
              />
            </div>
            Delete
          </li>
        </ul>
      </ActionModal>

      <DeleteDialog
        onClose={toggleDel}
        onConfirm={() => void deleteVc()}
        open={delOpen}
        text="to Are you sure delete this Credential?"
        title="Delete Credential"
      />
    </>
  );
};

export default Operation;
