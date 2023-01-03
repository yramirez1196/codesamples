import React from "react";
import { loadParallel } from "@parallelmarkets/vanilla";
import {
  ParallelProvider,
  useParallel,
  PassportButton,
} from "@parallelmarkets/react";
import { Button } from "components/common/button";
import clsx from "clsx";

import Styles from "./styles.module.scss";
import { UsersApiService } from "api/users/UsersApiService";

import { RevealYourNft } from "components/kyc/Reveal/RevealYourNft";

const parallel = loadParallel({
  client_id: process.env.NEXT_PUBLIC_PARALLET_CLIENT,
  environment:
    process.env.NEXT_PUBLIC_SERVER_BRANCH === "develop" ||
    process.env.NEXT_PUBLIC_SERVER_BRANCH === "staging"
      ? "demo"
      : "production",
  force_identity_check: true,
  scopes: ["profile", "identity", "accreditation_status"], //validar tambien si es o no americano
});
export const AccreditationArea = () => {
  /* 	const { user } = useUser(); */
  // the parallel variable provides access to the full SDK
  const { parallel, loginStatus } = useParallel();
  const [profileResponse, setProfileResponse] = React.useState<any>(null);
  // we may render before the loginStatus is available
  React.useEffect(() => {
    // user isn't authenticated or library isn't loaded yet
    if (loginStatus?.status === "connected")
      parallel.api("/me", setProfileResponse);
  }, [parallel, loginStatus]);

  React.useEffect(() => {
    /* 	ParallelVerify; */
    const { user_id } = profileResponse || {};
    const ArrayData = {
      parallelUserId: user_id,
      accessToken: loginStatus?.authResponse?.access_token,
      accessRefreshToken: loginStatus?.authResponse?.refresh_token,
    };

    profileResponse &&
      UsersApiService.ParallelVerify(ArrayData || "")
        .then((response: any) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
  }, [profileResponse]);
  return (
    <div
      className={clsx(
        "flex flex-col justify-center gap-y-16 ",
        Styles.paddingContainer
      )}
    >
      {/* 	<h1 className="text-2xl">Status: {loginStatus?.status}</h1> */}

      {loginStatus?.status !== "connected" ? (
        <>
          <div className="flex flex-col gap-y-6">
            <p className="text-xl text-white text-center">
              {" "}
              Kyc and Accredited Investor verification
            </p>
            <hr className="h-[1px] text-gray-800 px-8" />
          </div>
          <div className="flex justify-center">
            <PassportButton />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-y-10 ">
          <RevealYourNft></RevealYourNft>
          {/* <Button
						ButtonStyle="primary"
						typePadding="normal"
						onClick={parallel.logout}
					>
						Log Out
					</Button> */}
          <Button
            ButtonStyle="primaryTransparent"
            typePadding="normal"
            href="/Profile/DigitalTwins"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};
export const ParalletMarketComponent = () => {
  /* const { user } = useUser();
	const parallel = loadParallel({
		client_id: process.env.NEXT_PUBLIC_PARALLET_CLIENT,
		environment: 'demo',
		force_identity_check: true,
		scopes: ['profile', 'identity', user?.validation && 'accreditation_status'], //validar tambien si es o no americano
	}); */
  return (
    <ParallelProvider parallel={parallel}>
      <AccreditationArea />
    </ParallelProvider>
  );
};
