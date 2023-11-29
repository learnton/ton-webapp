import { ResultType } from "@/utils";
import { isVpWithTemplate } from "@/pages/card/_components/QrcodePresentation";

const handleScanResult = ([type, result]: ResultType) => {
  if (type === "vp") {
    let _result;

    if (isVpWithTemplate(result)) {
      _result = result.vp;
      setTemplateId(result.templateId);
    } else {
      _result = result as VerifiablePresentation;
    }

    if (!_result.proof.challenge) {
      setChallengeResult(
        <Typography color="warning.main">No challenge found</Typography>
      );
    } else if (isHex(_result.proof.challenge)) {
      setChallengeResult(
        <Typography color="warning.main">
          Verifiable Presentation challenge is: ${_result.proof.challenge}
        </Typography>
      );
    } else if (isNumber(Number(_result.proof.challenge))) {
      if (Date.now() <= Number(_result.proof.challenge) + 60 * 1000) {
        setChallengeResult(
          <Typography color="success.main">
            Verifiable Presentation time is:{" "}
            {moment(Number(_result.proof.challenge)).format(
              "YYYY-MM-DD HH:mm:ss"
            )}
          </Typography>
        );
      } else {
        setChallengeResult(
          <Typography color="error.main">
            Verifiable Presentation is expired:{" "}
            {moment(Number(_result.proof.challenge)).format(
              "YYYY-MM-DD HH:mm:ss"
            )}
          </Typography>
        );
      }
    } else {
      setChallengeResult(
        <Typography color="text.primary">
          Verifiable Presentation challenge is: ${_result.proof.challenge}
        </Typography>
      );
    }

    setVp(_result);
  } else if (type === "keys") {
    navigate("/import-account", {
      state: result,
    });
  }
};

export default handleScanResult;
