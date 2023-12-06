import { useContext, useEffect, useMemo, useState, memo } from "react";
import { Did, isDidUrl, helpers } from "@zcloak/did";
import { AppContext } from "@/context/AppProvider";
import { resolver } from "@/utils";

interface Props {
  defaultValue?: Did;
  withSelftButton?: string;
  disabled?: boolean;
  onChange?: (value?: string, did?: Did) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
function InputDid({
  defaultValue,
  disabled = false,
  onChange,
  withSelftButton,
}: Props) {
  const { didAccounts } = useContext(AppContext);
  const [value, setValue] = useState<Did | undefined>(defaultValue);
  const [error, setError] = useState<string>("");
  const [fetching, setFetching] = useState(false);

  const paddingRight = useMemo(() => {
    let _result = 0;
    if (withSelftButton) {
      _result += 100;
    }
    return _result;
  }, [withSelftButton]);

  useEffect(() => {
    if (isDidUrl(value)) {
      setFetching(true);
      resolver
        .resolve(value)
        .then((document) => {
          onChange?.(value, helpers.fromDidDocument(document));
          setError("");
        })
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setError(err);
          onChange?.(value);
        })
        .finally(() => setFetching(false));
    } else if (value) {
      setError("Invalid Did");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`relative pr-[${paddingRight}]px`}>
      <input
        type="text"
        className={`input input-bordered w-full${error ? " input-error" : ""}`}
        disabled={disabled}
        readOnly={fetching}
        onChange={(e) =>
          setValue((e.target.value.trim() || undefined) as Did | undefined)
        }
      />
      <div className="absolute right-0 top-3">
        {withSelftButton && (
          <div
            className="badge cursor-pointer"
            onClick={() =>
              setValue(didAccounts.current?.instance.id as Did | undefined)
            }
          >
            SELF
          </div>
        )}
      </div>
    </div>
  );
}

const exportComponent = memo(InputDid);

export default exportComponent;
