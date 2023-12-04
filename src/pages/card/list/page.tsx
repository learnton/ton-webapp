import { useMemo, useState } from "react";
// import IconSearch from "@/assets/img/icon_search.svg?react";
import { CARD_TYPE } from "@/components";
import { useAllCards } from "@/hooks";
import CredentialCard from "../_components/CredentialCard";
import CategoryFilter from "../_components/CategoryFilter";
import IconImport from "@/assets/img/icon_add.svg?react";
import CredentialImport from "../_components/CredentialImport";
import { DidUrl } from "@zcloak/did-resolver/types";
import { useDebounce } from "react-use";

const PageCredential = () => {
  const [openImport, toggleImport] = useState(false);

  const [category, setCategory] = useState<CARD_TYPE | number>(-1);
  const [issuer, setIssuer] = useState<DidUrl | string>("0x");
  const [titleOrId, setTitleOrId] = useState<string>();
  const [debouncedTitleOrId, setDebouncedTitleOrId] = useState<string>();
  useDebounce(
    () => {
      setDebouncedTitleOrId(titleOrId);
    },
    300,
    [titleOrId]
  );

  const { cards, categories, issuers, cardsCount } = useAllCards(
    category === -1 ? undefined : category,
    issuer === "0x" ? undefined : (issuer as DidUrl),
    debouncedTitleOrId
  );

  return (
    <div className="py-4">
      <div className="flex items-center">
        <h1 className="leading-loose font-bold text-xl flex-1">
          My zkID Cards
        </h1>
        {/* <button className="btn btn-circle bg-white btn-sm">
          <IconSearch />
        </button> */}
      </div>

      <div className="flex items-center mt-4 gap-2">
        <div className="font-medium flex-1">{cardsCount} Results</div>
        <button
          onClick={() => toggleImport(true)}
          className="bg-white font-sm font-rubik btn"
        >
          <IconImport />
          Import Card
        </button>
        <CategoryFilter
          issuers={issuers}
          onChange={(type, issuer) => {
            setCategory(type);
            setIssuer(issuer);
            console.log("change", type, issuer);
          }}
        />
      </div>

      <div className="mt-4">
        {cards?.map((item) => {
          return <CredentialCard id={item.id} key={item.id} showProof />;
        })}
      </div>
      {openImport && (
        <CredentialImport
          onClose={() => {
            toggleImport(false);
            window.location.reload();
          }}
          open={openImport}
        />
      )}
    </div>
  );
};

export default PageCredential;
