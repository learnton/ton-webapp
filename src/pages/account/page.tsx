import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppProvider";
import { Address } from "@/components";
import IdentityIcon from "@/components/IdentityIcon";
import IconAccount from "./_assets/icon_profile.svg?react";
import IconScan from "./_assets/icon_scan.svg?react";
import IconNoti from "./_assets/icon_notification.svg?react";
import IconRight from "@/assets/img/icon_go.svg?react";
import { useTwaSdk, useDidDB, useLiveQuery } from "@/hooks";
import CardBgURL from "./_assets/img_bg_card@2x.webp";
import { Link } from "react-router-dom";
import { extraResult, DidDB } from "@/utils";
import { useToast } from "@/components/Toast";
import { useRef } from "react";
import { fetchAndSaveMessages } from "@/pages/message/_utils";
import { useNavigate } from "react-router-dom";
import { useCredentials } from "@/hooks";
import handleScanResult from "./_util/handleScan";

export default function Account() {
  const { didAccounts } = useContext(AppContext);
  const did = didAccounts.current;
  const { UserInfo, WebApp } = useTwaSdk();
  const toast = useToast();
  const navigate = useNavigate();
  const didDB = useDidDB();
  const credentials = useCredentials();

  useEffect(() => {
    if (did && didDB) {
      void fetchAndSaveMessages(did, didDB);
    }
  }, [did, didDB]);

  const count =
    useLiveQuery(
      function getMessages(db: DidDB): Promise<number> {
        return db.cardMessages.filter((message) => !message.isRead).count();
      },
      didDB,
      []
    ) || 0;

  const handleScan: (text: string) => true | void = (text: string) => {
    extraResult(text, handleScanResult, (percent) => {
      console.log(percent);
    });
    return true;
  };

  const links = useRef([
    {
      name: "Profile",
      path: "",
    },
    {
      name: "Messages",
      path: "",
    },
    {
      name: "Settings",
      link: "",
    },
  ]);

  return (
    <>
      <div
        className="bg-[#C7D8FA] aspect-card rounded-3xl p-4 flex flex-col justify-center relative mb-20"
        style={{
          backgroundImage: `url(${CardBgURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute left-0 top-0 w-full box-border p-4 flex flex-row items-center">
          <Link to="/account/profile" className="btn btn-ghost btn-xs">
            <IconAccount />
          </Link>
          <button
            onClick={() => WebApp.showScanQrPopup({}, handleScan)}
            className="btn btn-ghost btn-xs"
          >
            <IconScan />
          </button>

          <div className="flex-1 text-right">
            {count > 0 && <span>{count} new message</span>}
          </div>
          <Link to="/message" className="btn btn-ghost btn-xs relative">
            {count > 0 && (
              <div className="absolute left-[50%] translate-x-[4px] top-0 w-2 h-2 overflow-hidden rounded-3xl bg-error"></div>
            )}
            <IconNoti />
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          {did && (
            <IdentityIcon
              value={did.instance.id}
              className="w-12 h-12 m-auto mask mask-circle bg-[#eee]"
            />
          )}
          <div className="flex-1">
            <p>{UserInfo.username || "--"}</p>
            <div className="font-medium text-[#191B1E]">
              {did && <Address value={did.instance.id} withCopy />}
            </div>
          </div>
        </div>
        {/* bottom card */}
        <Link
          to="/cards"
          className="bg-[#3D3E45] rounded-xl p-4 -bottom-12 flex items-center text-[#C7D8FA] absolute left-4 right-4"
        >
          <div className="flex-1 text-center">
            <p>zkID Cards</p>
            <div className="text-2xl text-white">
              {credentials?.length || 0}
            </div>
          </div>
          <div className="w-0 h-10 border-l-[1px] border-[#6A6A6A]"></div>
          <div className="flex-1 text-center">
            <p>view cards</p>
          </div>
        </Link>
      </div>

      <h1 className="font-medium text-[#111827] text-xl mb-4">
        What can you do?
      </h1>
      <ul className="flex flex-col gap-2 mb-4">
        {links.current.map((link, index) => (
          <li
            key={index}
            className="flex items-center p-4 rounded-xl bg-white"
            onClick={() =>
              link.link
                ? WebApp.openLink(link.link)
                : link.path
                ? navigate(link.path)
                : null
            }
          >
            <div className="flex-1">{link.name}</div>
            <IconRight />
          </li>
        ))}
      </ul>

      <button className="btn m-1" onClick={() => localStorage.clear()}>
        clear storage
      </button>
      <button
        className="btn m-1"
        onClick={() =>
          toast &&
          toast({
            type: "success",
            message: "success",
          })
        }
      >
        test Toast
      </button>
    </>
  );
}
