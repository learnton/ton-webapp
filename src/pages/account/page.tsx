import { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { DidContext } from "@/context/Did";
import { Address } from "@/components";
import IdentityIcon from "@/components/IdentityIcon";
import IconAccount from "./assets/icon_profile.svg?react";
import IconScan from "./assets/icon_scan.svg?react";
import IconNoti from "./assets/icon_notification.svg?react";
import useTwaSdk from "@/hooks/useTwaSdk";
import CardBgURL from "./assets/img_bg_card@2x.webp";
import { Link } from "react-router-dom";

export default function Account() {
  const { did } = useContext(DidContext);
  const { UserInfo } = useTwaSdk();
  const [noti, setNoti] = useState(0);

  useEffect(() => {
    setNoti(9);
  }, []);

  return (
    <>
      <div
        className="bg-[#C7D8FA] aspect-card rounded-3xl p-4 flex flex-col justify-center relative mb-16"
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
          <Link to="/account/scan" className="btn btn-ghost btn-xs">
            <IconScan />
          </Link>

          <div className="flex-1 text-right">
            {noti > 0 && <span>{noti} new message</span>}
          </div>
          <Link to="/account/message" className="btn btn-ghost btn-xs relative">
            {noti && (
              <div className="absolute left-[50%] translate-x-[6px] top-0 w-2 h-2 overflow-hidden rounded-3xl bg-error"></div>
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
            <p className="text-sm">{UserInfo.username || "--"}</p>
            <div className="font-medium text-[#191B1E]">
              {did && <Address value={did.instance.id} withCopy />}
            </div>
          </div>
        </div>
        {/* bottom card */}
        <div className="bg-[#3D3E45] rounded-xl p-4 -bottom-12 flex items-center text-[#C7D8FA] absolute left-4 right-4">
          <div className="flex-1 text-center">
            <p>zkID Cards</p>
            <div className="text-2xl text-white">{342}</div>
          </div>
          <div className="w-0 h-10 border-l-[1px] border-[#6A6A6A]"></div>
          <div className="flex-1 text-center">
            <p>view cards</p>
          </div>
        </div>
      </div>
      <button className="btn" onClick={() => localStorage.clear()}>
        clear storage
      </button>
    </>
  );
}