import { useContext } from "react";
import { AppContext } from "@/context/AppProvider";
import { useTwaSdk } from "@/hooks";
import { Address, QRCode, IdentityIcon } from "@/components";
import IconRight from "@/assets/img/icon_go.svg?react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentDid } = useContext(AppContext);
  const did = currentDid();
  const { UserInfo } = useTwaSdk();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-2">
        <div className="py-4">
          {did && (
            <IdentityIcon
              value={did.instance.id}
              className="w-20 h-20 m-auto mask mask-circle bg-[#eee]"
            />
          )}
        </div>
        <p className="font-bold text-xl">{UserInfo.username || "--"}</p>
        <div className="font-medium text-[#191B1E]">
          {did && <Address value={did.instance.id} withCopy />}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="aspect-square rounded-2xl shadow-xl m-4 p-4 bg-white overflow-hidden">
          {did ? <QRCode accountId={did?.instance.id} /> : <>loading</>}
        </div>
        <div className="text-center">Your DID Profile</div>
      </div>

      <div className="flex flex-col gap-4">
        {/* <Link
          to="/account/manage"
          className="flex items-center p-4 bg-white rounded"
        >
          <div className="flex-1">
            <div className="font-medium color-[#191B1E]">
              Manage My Accounts
            </div>
            <p className="text-sm">
              Create, import, delete, and switch for login
            </p>
          </div>
          <IconRight />
        </Link> */}
        <Link
          to="/account/keys"
          className="flex items-center p-4 bg-white rounded"
        >
          <div className="flex-1">
            <div className="font-medium color-[#191B1E]">My Keys</div>
            <p className="text-sm">View and backup your private keys</p>
          </div>
          <IconRight />
        </Link>
      </div>
    </div>
  );
}
