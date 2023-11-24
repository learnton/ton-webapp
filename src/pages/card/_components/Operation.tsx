// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import saveAs from "file-saver";
import { useCallback, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { VerifiableCredential } from "@zcloak/vc/types";
import BtnDelete from "../_assets/btn_delete.svg?react";
import IconBackup from "../_assets/btn_backup.svg?react";
import IconMore from "../_assets/btn_more.svg?react";
import IconShare from "../_assets/btn_share.svg?react";
import { WarpVcWithTemplate } from "@/types";
import { AppContext } from "@/context/AppProvider";
import { useDidDB, useToggle } from "@/hooks";
import { CARD_TYPE, DeleteDialog } from "@/components";

interface Props {
  credential?: VerifiableCredential<boolean> | null;
  templateId?: CARD_TYPE;
  credentialId?: string;
}

const Operation: React.FC<Props> = ({
  credential,
  credentialId,
  templateId,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, toggle] = useToggle();
  const [delOpen, toggleDel] = useToggle();
  const { credentialCard } = useContext(AppContext);
  const didDB = useDidDB();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    toggle();
  }, [toggle]);

  const download = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();

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

      saveAs(blobSiningJson, "credential.json");

      handleClose();
    },
    [credential, templateId, handleClose]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
      toggle();
    },
    [toggle]
  );

  const deleteVc = useCallback(async () => {
    if (credentialId) {
      await didDB?.zkCredential.delete(credentialId);
      await didDB?.cardTemplateRelation.delete(credentialId);
      await credentialCard.delete(credentialId);

      toggleDel();
      navigate(-1);
    }
  }, [didDB, credentialCard, toggleDel, navigate, credentialId]);

  return (
    <>
      <div className="menu">
        <Link className={"btn" + !templateId ? " btn-disabled" : ""} to="share">
          <IconShare />
        </Link>
        <details>
          <summary>
            <button className="btn" onClick={handleClick}>
              <IconMore />
            </button>
          </summary>
          <div className="px-2 w-[200px]">
            <button className="btn" onClick={download}>
              Backup Card
              <IconBackup />
            </button>
            <button className="btn" onClick={toggleDel}>
              Delete
              <BtnDelete />
            </button>
          </div>
        </details>
      </div>

      {delOpen && (
        <DeleteDialog
          onClose={toggleDel}
          onConfirm={deleteVc}
          open={delOpen}
          text="Are you sure to delete this Credential?"
          title="Delete Credential"
        />
      )}
    </>
  );
};

export default Operation;
