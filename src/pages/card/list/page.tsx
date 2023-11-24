import { useMemo, useState } from "react";
// import IconSearch from "@/assets/img/icon_search.svg?react";
import { CARD_TYPE } from "@/components";
import { useCredentialByCate, useCredentials } from "@/hooks";
import CredentialCard from "../_components/CredentialCard";
import CategoryFilter from "../_components/CategoryFilter";

const PageCredential = () => {
  // const [open, toggleImport] = useToggle();
  const [cate, setCate] = useState<CARD_TYPE>();
  const credentials = useCredentials();
  const filterVcs = useCredentialByCate(cate);

  const showVcs = useMemo(() => {
    return typeof cate === "number" ? filterVcs : credentials;
  }, [filterVcs, credentials, cate]);

  return (
    <div>
      <div className="flex items-center">
        <h1 className="leading-loose font-bold text-xl flex-1">
          My zkID Cards
        </h1>
        {/* <button className="btn btn-circle bg-white btn-sm">
          <IconSearch />
        </button> */}
      </div>

      <div className="flex items-center mt-2">
        <div className="font-medium flex-1">{showVcs?.length || 0} Results</div>
        <div>
          {/* <button onClick={toggleImport} className="btn-secondary">
              <IconImportVc />
              Import
            </button> */}
          <CategoryFilter onCateChange={setCate} />
        </div>
      </div>

      <div className="mt-4">
        {showVcs?.map((item) => {
          return <CredentialCard id={item.id} key={item.id} />;
        })}
      </div>
      {/* {open && <CredentialImport onClose={toggleImport} open={open} />} */}
    </div>
  );
};

export default PageCredential;
