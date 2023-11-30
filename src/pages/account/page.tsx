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
import { ScanContext } from "@/context/ScanProvider";

export default function Account() {
  const { didAccounts } = useContext(AppContext);
  const ScanState = useContext(ScanContext);
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
    extraResult(
      text,
      (result) => {
        if (result.length === 2) {
          ScanState.type = result[0];
          ScanState.result = result[1];
        }
      },
      (percent) => {
        console.log(percent);
      }
    );
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
    <div className="py-4">
      <div
        className="flex flex-col bg-[#C7D8FA] rounded-3xl mb-20 aspect-card justify-center relative"
        style={{
          backgroundImage: `url(${CardBgURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-row w-full p-4 top-0 left-0 absolute box-border items-center">
          <Link to="/account/profile" className="btn btn-ghost btn-xs">
            <IconAccount />
          </Link>
          <button
            onClick={() => {
              navigate("/scan");
              // WebApp.showScanQrPopup({}, handleScan)
            }}
            className="btn btn-ghost btn-xs"
          >
            <IconScan />
          </button>

          <div className="flex-1 text-right">
            {count > 0 && <span>{count} new message</span>}
          </div>
          <Link to="/message" className="btn btn-ghost btn-xs relative">
            {count > 0 && (
              <div className="bg-error rounded-3xl h-2 top-0 left-[50%] w-2 translate-x-[4px] absolute overflow-hidden"></div>
            )}
            <IconNoti />
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center pl-4">
          {did && (
            <IdentityIcon
              value={did.instance.id}
              className="bg-[#eee] m-auto h-12 w-12 mask mask-circle"
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
          className="rounded-xl flex bg-[#3D3E45] p-4 right-4 -bottom-12 left-4 text-[#C7D8FA] items-center absolute"
        >
          <div className="flex-1 text-center">
            <p>zkID Cards</p>
            <div className="text-white text-2xl">
              {credentials?.length || 0}
            </div>
          </div>
          <div className="border-l-[1px] border-[#6A6A6A] h-10 w-0"></div>
          <div className="flex-1 text-center">
            <p>view cards</p>
          </div>
        </Link>
      </div>

      <h1 className="font-medium text-xl mb-4 text-[#111827]">
        What can you do?
      </h1>
      <ul className="flex flex-col mb-4 gap-2">
        {links.current.map((link, index) => (
          <li
            key={index}
            className="bg-white rounded-xl flex p-4 items-center"
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

      <button className="m-1 btn" onClick={() => localStorage.clear()}>
        clear storage
      </button>
      <button
        className="m-1 btn"
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
    </div>
  );
}
