import * as React from 'react';
import { useToasts } from 'react-toast-notifications';

import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { NftsApiServices } from 'api/nfts/NftsService';

export const UseContractFunctions = () => {
	const [contract, setContract] = React.useState<any>(null);
	const [userBalance, setUserBalance] = React.useState<any>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isMinted, setisMinted] = React.useState<boolean>(false);

	const [quantityToMint, setQuantityToMint] = React.useState<number>(1);

	const price = process.env.NEXT_PUBLIC_NETWORK === '1' ? 1.25 : 0.01;
	const { addToast } = useToasts();

	const { account, library } = useWeb3React();

	const getAccountBalance = async () => {
		try {
			await library?.provider
				.request({
					method: 'eth_getBalance',
					params: [account, 'latest'],
				})
				.then((balance: any) => {
					setUserBalance(ethers.utils.formatEther(balance));
				});
		} catch (error: any) {
			console.log(error);
		}
	};
	const Mint = async () => {
		setIsLoading(true);
		/* console.log(quantityToMint);
		console.log(account); */
		if (userBalance < price * quantityToMint) {
			setIsLoading(false);
			addToast('You dont have enough ETH in order to mint in this account', {
				appearance: 'error',
			});
			return false;
		}

		/* if (user?.wallet !== account) {
			setIsLoading(false);
			addToast(
				'Your wallet address is different from the registered user address',
				{
					appearance: 'error',
				}
			);
			return false;
		} */

		try {
			await (contract as any).methods
				.safeMint(quantityToMint)
				.send({
					from: account,
					value: price * Math.pow(10, 18) * quantityToMint,
				})
				.on('transactionHash', () => {
					addToast('Please Wait', {
						appearance: 'info',
					});
				})
				.on('receipt', (response: any) => {
					if (quantityToMint > 1) {
						response?.events?.Transfer?.forEach((element: any) => {
							const dataCreateNft = {
								address: account,
								collectibleId: element?.returnValues?.tokenId,
							};

							NftsApiServices.createNft(dataCreateNft)
								.then((res: any) => {
									console.log(res);
								})
								.catch((error: any) => {
									console.log(error);
								});
						});
					} else {
						const dataCreateNft = {
							address: account,
							collectibleId: response?.events?.Transfer?.returnValues?.tokenId,
						};
						NftsApiServices.createNft(dataCreateNft)
							.then((res: any) => {
								console.log(res);
							})
							.catch((error: any) => {
								console.log(error);
							});
					}

					/* const dataCreateNft = {
						address: account,
						collectibleId: response?.events?.Transfer?.returnValues?.tokenId,
					}; */
					/* NftsApiServices.createNft(dataCreateNft)
						.then((res: any) => {
							console.log(res);
						})
						.catch((error: any) => {
							console.log(error);
						}); */
					setisMinted(true);
				});
		} catch (error: any) {
			console.log(error);
			addToast(error.message, {
				appearance: 'error',
			});

			setIsLoading(false);
		}
	};

	return {
		getAccountBalance,
		setContract,
		isLoading,
		Mint,
		isMinted,
		setisMinted,

		setQuantityToMint,
		price,
	};
};
