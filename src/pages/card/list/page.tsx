import { useState, useRef } from "react";
import IconSearch from "@/assets/img/icon_search.svg?react";
import IconClose from "../_assets/icon_close.svg?react";
import { CARD_TYPE } from "@/components";
import { useAllCards } from "@/hooks";
import CredentialCard from "../_components/CredentialCard";
import CategoryFilter, {
  DEFAULT_TYPE,
  DEFAULT_ISSUER,
} from "../_components/CategoryFilter";
import IconImport from "@/assets/img/icon_add.svg?react";
import CredentialImport from "../_components/CredentialImport";
import { DidUrl } from "@zcloak/did-resolver/types";
import { useDebounce } from "react-use";

const PageCredential = () => {
  const [openImport, toggleImport] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [category, setCategory] = useState<CARD_TYPE | -1>(DEFAULT_TYPE);
  const [issuer, setIssuer] = useState<DidUrl | "0x">(DEFAULT_ISSUER);
  const [titleOrId, setTitleOrId] = useState<string>();
  const [debouncedTitleOrId, setDebouncedTitleOrId] = useState<string>();
  useDebounce(
    () => {
      setDebouncedTitleOrId(titleOrId);
    },
    300,
    [titleOrId]
  );

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleSearch = (openSearch: boolean) => {
    setOpenSearch(openSearch);
    if (openSearch) {
      setCategory(DEFAULT_TYPE);
      setIssuer(DEFAULT_ISSUER);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const { cards, categories, issuers, cardsCount } = useAllCards(
    category === DEFAULT_TYPE ? undefined : category,
    issuer === DEFAULT_ISSUER ? undefined : issuer,
    debouncedTitleOrId
  );

  console.log("categories=", categories);

  return (
    <div className="py-4">
      <div className="flex items-center">
        <h1 className="font-bold flex-1 text-xl leading-loose">
          My zkID Cards
        </h1>

        <label className="bg-white btn btn-circle swap swap-rotate">
          <input
            type="checkbox"
            onChange={(e) => handleToggleSearch(e.target.checked)}
          />
          <IconSearch className="h-5 w-5 swap-off" />
          <IconClose className="h-5 w-5 swap-on" />
        </label>
      </div>

      {openSearch ? (
        <div className=" mt-4 relative">
          <IconSearch className="h-5 top-4 left-2 w-5 absolute" />
          <input
            ref={searchInputRef}
            type="text"
            className="w-full pl-10 input input-bordered "
            placeholder="Search Template Title/ID"
            onChange={(e) => setTitleOrId(e.target.value.trim())}
          />
        </div>
      ) : (
        <div className="flex mt-4 gap-2 items-center">
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
      )}

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
