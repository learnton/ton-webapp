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
      {templateId && (
        <div className="p-2 text-xs text-center">
          <IconShowProof className="m-auto" />
          <div>Show Proof</div>
        </div>
      )}
      <div
        role="button"
        className="p-2 text-xs text-center"
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
          <Link className={LiClass} to="share">
            <div className="p-2 bg-[#fff7e6] text-[0px] rounded-3xl">
              <img
                src={IconShare}
                alt="Share"
                className="w-4 h-4 object-contain"
              />
            </div>
            Share Card
          </Link>
          <li className={LiClass} onClick={download}>
            <div className="p-2 bg-[#effbf3] text-[0px] rounded-3xl">
              <img
                src={IconBackup}
                alt="Share"
                className="w-4 h-4 object-contain"
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
            <div className="p-2 bg-[#fff3f3] text-[0px] rounded-3xl">
              <img
                src={IconDelete}
                alt="Share"
                className="w-4 h-4 object-contain"
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
        text="Are you sure to delete this Credential?"
        title="Delete Credential"
      />
    </>
  );
};

export default Operation;
