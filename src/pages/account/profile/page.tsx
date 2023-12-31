import { useContext, useState } from "react";
import { AppContext } from "@/context/AppProvider";
import { useTwaSdk, useDidDB } from "@/hooks";
import { Address, QRCode, IdentityIcon, ConfirmDialog } from "@/components";
import IconRight from "@/assets/img/icon_go.svg?react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { didAccounts } = useContext(AppContext);
  const did = didAccounts.current;
  const { UserInfo } = useTwaSdk();
  const didDB = useDidDB();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    void didDB?.delete();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-10 py-4">
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
        <button
          className="btn btn-error text-white"
          onClick={() => setShowConfirm(true)}
        >
          Reset Account
        </button>
      </div>

      <ConfirmDialog
        title="Reset Account"
        text="Are you sure you want to reset your DID?"
        type="error"
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}
