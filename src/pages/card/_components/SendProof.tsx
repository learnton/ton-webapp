import { BaseTempProps, InputDid, ActionModal } from "@/components";
import { useMemo, useState, useContext } from "react";
// import { useCType } from "@/hooks";
import { Did } from "@zcloak/did";
import { Message } from "@zcloak/message/types";
import { VerifiablePresentationBuilder } from "@zcloak/vc";
import { VerifiableCredential, VerifiablePresentation } from "@zcloak/vc/types";
import { AppContext } from "@/context/AppProvider";
import { encrypt } from "@/utils";
import { postMessage } from "@/api/card";
import Steps from "./Steps";

interface Props {
  vc: VerifiableCredential<boolean>;
  template?: BaseTempProps;
  open: boolean;
  onClose?: () => void;
}

const SendProof = ({ template, vc, open, onClose }: Props) => {
  const [holder, setHolder] = useState<Did | undefined>();
  const [antSwitchChecked, setAntSwitchChecked] = useState(false);
  // const { ctype } = useCType(template?.ctypeHash || vc.ctype);
  const attributes = useMemo(() => Object.keys(vc.credentialSubject), [vc]);
  const [selectedAttributes, setSelectAttributes] =
    useState<string[]>(attributes);

  const handleAntSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAntSwitchChecked(event.target.checked);

    if (event.target.checked) {
      setSelectAttributes([]);
    }
  };

  const { didAccounts } = useContext(AppContext);
  const sender = didAccounts.current?.instance;
  const [encryptedMessage, setEncryptedMessage] =
    useState<Message<"Send_issuedVC" | "Send_VP">>();
  const [presentation, setPresentation] = useState<
    VerifiablePresentation | undefined
  >();

  const handleSendVP = () => {
    const builder = new VerifiablePresentationBuilder(sender as Did);

    builder
      .addVC(vc, "VP_SelectiveDisclosure", attributes)
      .build()
      .then(setPresentation);
  };

  return (
    <>
      <ActionModal open={open} onClose={onClose} title="Card Send">
        {holder && presentation ? (
          <Steps
            start={!!(holder && presentation)}
            onDone={onClose}
            steps={[
              {
                label: "Encrypt message",
                exec: () =>
                  encrypt<"Send_VP">(
                    "Send_VP",
                    presentation,
                    sender,
                    holder
                  ).then(setEncryptedMessage),
              },
              {
                label: "Send and save message",
                exec: () =>
                  postMessage({
                    msg: encryptedMessage,
                    templateId: template?.id,
                  }),
              },
            ]}
          />
        ) : (
          <>
            <div className="font-semibold my-2">Claimer</div>
            <InputDid onChange={(_url, did) => setHolder(did)} />
            <div className="flex flex-col py-4 gap-4 w-full">
              <div className="font-semibold flex-1">
                Choose Data Fields to Disclose
              </div>
              <div className="flex items-center gap-1 text-text2 text-sm ">
                <input
                  type="checkbox"
                  className="toggle toggle-warning"
                  checked={antSwitchChecked}
                  onChange={handleAntSwitchChange}
                />
                <div>I don’t wish to disclose</div>
              </div>
              {attributes.map((key) => {
                return (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAttributes.includes(key)}
                      onChange={() =>
                        selectedAttributes.includes(key)
                          ? setSelectAttributes((attributes) =>
                              attributes.filter(
                                (attribute) => attribute !== key
                              )
                            )
                          : setSelectAttributes((attributes) => [
                              ...attributes,
                              key,
                            ])
                      }
                      className="checkbox"
                    />
                    <div>{key}</div>
                  </label>
                );
              })}
            </div>
          </>
        )}

        <div className="flex gap-2 items-center mt-8">
          <button className="btn flex-1" onClick={() => onClose?.()}>
            Cancel
          </button>
          <button
            className="btn btn-primary flex-1"
            disabled={!holder || !template?.id}
            onClick={() => {
              if (template?.id && holder) {
                handleSendVP();
              } else {
                console.warn(template?.id && holder);
              }
            }}
          >
            Send Card
          </button>
        </div>
      </ActionModal>
    </>
  );
};

export default SendProof;
