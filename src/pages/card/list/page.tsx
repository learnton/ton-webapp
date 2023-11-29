import { useMemo, useState } from "react";
// import IconSearch from "@/assets/img/icon_search.svg?react";
import { CARD_TYPE } from "@/components";
import { useCredentialByCate, useCredentials } from "@/hooks";
import CredentialCard from "../_components/CredentialCard";
import CategoryFilter from "../_components/CategoryFilter";
import IconImport from "@/assets/img/icon_add.svg?react";
import CredentialImport from "../_components/CredentialImport";

const PageCredential = () => {
  const [openImport, toggleImport] = useState(false);
  const [cate, setCate] = useState<CARD_TYPE>();
  const credentials = useCredentials();
  const filterVcs = useCredentialByCate(cate);

  const showVcs = useMemo(() => {
    return typeof cate === "number" ? filterVcs : credentials;
  }, [filterVcs, credentials, cate]);

  return (
    <>
      <div className="flex items-center">
        <h1 className="leading-loose font-bold text-xl flex-1">
          My zkID Cards
        </h1>
        {/* <button className="btn btn-circle bg-white btn-sm">
          <IconSearch />
        </button> */}
      </div>

      <div className="flex items-center mt-4 gap-2">
        <div className="font-medium flex-1">{showVcs?.length || 0} Results</div>
        <button
          onClick={() => toggleImport(true)}
          className="bg-white font-sm font-rubik btn"
        >
          <IconImport />
          Import Card
        </button>
        <CategoryFilter onCateChange={setCate} />
      </div>

      <div className="mt-4">
        {showVcs?.map((item) => {
          return <CredentialCard id={item.id} key={item.id} showProof />;
        })}
      </div>
      {openImport && (
        <CredentialImport
          onClose={() => toggleImport(false)}
          open={openImport}
        />
      )}
    </>
  );
};

export default PageCredential;
