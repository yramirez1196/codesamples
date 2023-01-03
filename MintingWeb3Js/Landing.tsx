import React from 'react';
/* import clsx from 'clsx'; */
/* import Styles from './styles.module.scss'; */

import { KnowTheTeamComponent } from './LandingSections/KnowTheTeam';

import { PartnersComponent } from './LandingSections/Partners';
import { PageContext } from 'components/layout';
import AbodeCollectionABI from '../../contracts/AbodeCollection.json';
/* import { useModalWithLogo } from 'hooks/modalWithLogo'; */

import { WhatIsAbodeComponent } from './LandingSections/WhatIsAbode';

import { useWeb3React } from '@web3-react/core';
import getWeb3 from 'components/getWeb3';
import { Rewards } from './LandingSections/Rewards';
import { MainContainer } from './LandingSections/MainContainer';
import { Tutorials } from './LandingSections/Tutorials';
import { Roadmap } from './LandingSections/Roadmap';
import { NftsInformation } from './LandingSections/NftsInformation';
import { IVVCollection } from './LandingSections/IVVCollection/IVVCollection';
import Styles from './styles.module.scss';
import clsx from 'clsx';
import { FrequentlyQuestions } from './LandingSections/FrequentlyQuestions';
export const LandingComponent = () => {
	const { account } = useWeb3React();
	const { getAccountBalance, setContract /* , setisMinted */ } =
		React.useContext(PageContext);
	const ConnectWeb3Contract = async () => {
		const web3 = await getWeb3();
		const mainContract = process.env.NEXT_PUBLIC_MAIN_CONTRACT;

		const contractInstance = new (web3 as any).eth.Contract(
			AbodeCollectionABI.abi,
			mainContract
		);
		setContract(contractInstance);
		getAccountBalance();
	};
	React.useEffect(() => {
		if (account) {
			ConnectWeb3Contract();
		}
	}, [account]);

	return <>{/* Landing Minting Web3Js */}</>;
};
