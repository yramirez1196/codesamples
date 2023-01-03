import SumsubWebSdk from "@sumsub/websdk-react";
import React from "react";
import { KycApiServices } from "./../../api/users/kycProcess/KycProcess";
import { useUser } from "hooks/user";
import { tokenApplicant } from "interfaces";
import { Button } from "components/common/button/button";
import Link from "next/link";
import { Icon } from "components/icon";
import { Icons } from "consts";
const SumSub = () => {
  const { user } = useUser();
  const [ApplicantToken, setApplicantToken] = React.useState<string>("");
  const [FinishKYC, setFinishKYC] = React.useState(false);
  React.useEffect(() => {
    user?.id &&
      KycApiServices.createApplicant(user?.id)
        .then((response: tokenApplicant) => {
          console.log(response.token);
          setApplicantToken(response.token);
        })
        .catch((error: any) => {
          console.log(error);
        });
  }, [user?.id]);

  function getNewAccessToken() {
    return KycApiServices.createApplicant(user?.id); // get a new token from your backend
  }
  function onMessage(message: any) {
    // console.log('meessa: ', message);
    // if (message.idCheck?.onApplicantSubmitted) setFinishKYC(true);
    if (message === "idCheck.onApplicantSubmitted") setFinishKYC(true);
  }
  function onError(error: any) {
    console.log(error);
  }

  return (
    <>
      <Link href="/profile">
        <div className="flex items-center justify-end focus:outline-none cursor-pointer mb-10">
          <Icon src={Icons.icon_Close} />
        </div>
      </Link>
      {ApplicantToken && (
        <SumsubWebSdk
          accessToken={ApplicantToken || ""}
          expirationHandler={getNewAccessToken}
          // config={config}
          // options={options}
          onMessage={onMessage}
          onError={onError}
        />
      )}
      {FinishKYC && (
        <div className="text-center">
          <Button
            className="mt-10 px-8 py-3 mb-10 font-bold bg-primary text-white f-18 hover:bg-dark-2 leading-4"
            label="Back to profile"
            type="button"
            disabled={false}
            href="/profile"
          />
        </div>
      )}
    </>
  );
};

export default SumSub;
