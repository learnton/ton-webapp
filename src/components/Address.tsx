import { useState } from "react";
import IconCopy from "@/assets/img/icon_copy.svg?react";
import IconDone from "@/assets/img/icon_true.svg?react";
import { useCopyToClipboard } from "react-use";
import { shortString } from "@/utils";

function Address({
  showFull,
  value,
  withCopy,
  showAfterLength = 8,
  showBeforeLength,
}: {
  value?: string | null;
  showFull?: boolean;
  withCopy?: boolean;
  showAfterLength?: number;
  showBeforeLength?: number;
}) {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [showTip, setShowTip] = useState(false);

  if (!value) {
    return null;
  }

  const handleCopy = () => {
    copyToClipboard(value);
    setShowTip(true);
    setTimeout(() => {
      setShowTip(false);
    }, 2000);
  };

  return (
    <div className="inline-flex items-center">
      <div className="flex-1">
        {showFull
          ? value
          : shortString(
              value,
              showBeforeLength ? showBeforeLength : showAfterLength + 7,
              showAfterLength
            )}
      </div>
      {withCopy &&
        (state.value && showTip ? (
          <IconDone className="w-4 h-4 ml-2 cursor-pointer" />
        ) : (
          <IconCopy
            className="w-4 h-4 ml-2 cursor-pointer"
            onClick={() => handleCopy()}
          />
        ))}
    </div>
  );
}

export default Address;
