import { useCallback, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import { base64Decode } from "@zcloak/crypto";
import { DidContext } from "@/context/Did";

import { scrypt } from "@/utils";

export default function RecoverySeedPhrase() {
  const { didAccounts: accounts } = useContext(DidContext);
  const [password, setPassword] = useState<string>();
  const [mnemonic, setMnemonic] = useState<string>();
  const location = useLocation();
  const toast = useToast();
  const navigate = useNavigate();

  const handleShow = useCallback(() => {
    if (!password || !accounts?.encryptedMnemonic) return;

    try {
      setMnemonic(
        scrypt.mnemonicDecrypt(
          base64Decode(accounts.encryptedMnemonic),
          password
        )
      );
    } catch (error) {
      toast &&
        toast({
          type: "error",
          value: "Incorrect password",
        });
    }
  }, [password, accounts.encryptedMnemonic]);

  return (
    <PageContainer>
      <PageContainerHeader title="Security" />
      <PageContainerContent>
        {mnemonic ? (
          <Stack alignItems="flex-start" spacing={1.5}>
            <InputMnemonic label="Recovery Seed Phrase" value={mnemonic} />
            <CopyButton value={mnemonic} />
          </Stack>
        ) : (
          <>
            {accounts.encryptedMnemonic ? (
              <InputPassword
                autoComplete="current-password"
                autoFocus
                label="Recovery Seed Phrase"
                onChange={setPassword}
                placeholder="Password"
                withBorder
              />
            ) : (
              <Typography color="error">
                {"You don't have recovery seed phrase."}
              </Typography>
            )}
          </>
        )}
      </PageContainerContent>
      <PageContainerAction>
        {mnemonic ? (
          <Button fullWidth onClick={() => navigate(-1)} variant="contained">
            Confirm
          </Button>
        ) : (
          <>
            {accounts.encryptedMnemonic ? (
              <Button
                disabled={!password}
                fullWidth
                onClick={handleShow}
                variant="contained"
              >
                Show Seed
              </Button>
            ) : (
              <Button
                component={Link}
                fullWidth
                to={{
                  pathname: "/create-account",
                  search: `?redirect=${location.pathname}${location.search}`,
                }}
                variant="contained"
              >
                Create Account
              </Button>
            )}
          </>
        )}
      </PageContainerAction>
    </PageContainer>
  );
}
