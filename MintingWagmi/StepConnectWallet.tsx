import clsx from 'clsx';
import { Button } from 'components/common/button';
import { Icon } from 'components/icon';
import { IconsArrows, IconsPayment } from 'consts';
import React from 'react';

import {
	useAccount,
	useConnect,
	useDisconnect,
	usePrepareContractWrite,
	useContractWrite,
	/* useSwitchNetwork, */
	useWaitForTransaction,
} from 'wagmi';
import { ethers } from 'ethers';

//import { useRouter } from 'next/router';

import ContractAbi from '../../../contracts/contractExample.json';
import { useToasts } from 'react-toast-notifications';
import { NetworkSwitcher } from 'components/WagmiComponents/NetworkSwitcher';

import { LoadingComponent } from 'components/loading';
interface Props {
	setStepPayment?: React.Dispatch<React.SetStateAction<number>>;
}
export const StepConnectWallet: React.FC<Props> = ({ setStepPayment }) => {
	/*const CalculateAmount = () => {
			 	const Calculate =
			QuantityNft &&
			BasePriceNftEth &&
			parseInt(QuantityNft) * parseFloat(BasePriceNftEth?.toString());

		return Calculate;
	}; */

	const { addToast } = useToasts();
	const {
		connect,
		connectors,
		/* error,*/ isLoading: isLoadingUseConnect,
		pendingConnector,
	} = useConnect();
	const { address, isConnected } = useAccount();

	const { disconnect } = useDisconnect();

	const [InsufficientFundsBand, setInsufficientFundsBand] = React.useState('');

	const IconWallet = (name: string) => {
		switch (name) {
			case 'MetaMask':
				return IconsPayment.IconMetamask;
			case 'Coinbase Wallet':
				return IconsPayment.IconCoinbase;

			default:
				return IconsPayment.IconNft;
		}
	};

	const {
		config,
		error: ErrorConfigMint,
		isError,
	} = usePrepareContractWrite({
		abi: ContractAbi.abi,
		address: `0x${process.env.NEXT_PUBLIC_MAIN_CONTRACT}` || '',
		functionName: 'safeMint',
		args: [],
		overrides: {
			from: address || undefined,
			value: ethers.utils.parseEther('0.08'),
			/* price.toString() */
		},
	});

	const {
		data: dataMint,
		//error: ErrorMint,
		// isLoading: isLoading2,
		/* isSuccess, */

		write,
	} = useContractWrite({
		...config,
		onError(error) {
			console.log('Error', error);
		},
		onSuccess(data) {
			console.log('Success', data);
		},
	});

	/* React.useEffect(() => {
		CalculatePrices();
	}, []); */

	/* 	const [isLoading, setisLoading] = React.useState(true); */
	const {
		//data: dataWaitForTransaction,
		//isError: IsError2,
		isLoading,
		//	isSuccess,
	} = useWaitForTransaction({
		confirmations: 1,
		hash: dataMint?.hash,
		onSuccess(data2) {
			console.log('Success2', data2);
			setStepPayment && setStepPayment(2);
		},
		onError(error) {
			console.log('Error', error);
		},
	});
	React.useEffect(() => {
		const ErrorConfigMintJson: any = ErrorConfigMint;

		if (
			ErrorConfigMintJson?.reason &&
			InsufficientFundsBand !== ErrorConfigMintJson?.reason
		) {
			addToast(ErrorConfigMintJson?.reason, { appearance: 'error' });
			setInsufficientFundsBand(ErrorConfigMintJson?.reason);
		}
	}, [ErrorConfigMint]);

	return (
		<div className={clsx('px-20')}>
			<div className="text-center mb-10">
				<h5 className={clsx('font-bold text-primary')}>Connect Wallet</h5>
				<p className={clsx('font-normal text-gray-0 mt-6 ')}>
					Select the wallet you want to connect to?
				</p>
				{isLoading && (
					<div className="mt-12">
						<LoadingComponent />
						<p className="mt-4 text-lg font-bold text-white">
							{' '}
							Please Wait...{' '}
						</p>
					</div>
				)}
			</div>
			<div className="flex flex-col">
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 order-2 md:order-1">
					{!isConnected &&
						!isLoading &&
						connectors.map((connector) => (
							<Button
								key={connector.id}
								onClick={() => {
									connect({ connector });
									/* 		router.push('/buy?wallet=true'); */
								}}
								className={clsx(
									'w-full p-6 border rounded-2xl',
									' bg-gray-800 border-gray-250'
								)}
							>
								<div className="flex items-center justify-between">
									<p className="text-white font-bold text-xl">
										{connector.name}
										{isLoadingUseConnect &&
											connector.id === pendingConnector?.id &&
											' (connecting)'}
									</p>
									<Icon
										src={IconWallet(connector.name) || ''}
										className="w-11 h-11"
									></Icon>
								</div>
							</Button>
						))}
				</div>
				<div>
					{!isLoading && isConnected && (
						<div>
							{/* 		<div>Connected to {connector?.name}</div> */}
							<div className="text-center">
								{' '}
								<p className="text-white font-bold text-xl">
									{'Address: '}
									{address?.substring(0, 6)}...
									{address?.substring(address.length - 4, address.length)}
								</p>
							</div>
							<NetworkSwitcher></NetworkSwitcher>
							<div className="grid grid-cols-2 gap-x-10 mt-3">
								<Button
									disabled={isLoading}
									ButtonStyle="secondaryTransparent"
									onClick={() => {
										disconnect();
									}}
								>
									Disconnect
								</Button>
								<Button
									disabled={isLoading || isError}
									ButtonStyle="primary"
									className="py-4"
									onClick={() => {
										write && write();
										/* console.log('hola'); */
									}}
								>
									{isLoading ? 'Loading...' : 'Pay'}
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* <div className="mt-6 order-1 md:order-2">
					<p className="text-base text-white">
						If you don't have a wallet yet,{' '}
						<a className="text-yellow-0 font-bold cursor-pointer">
							here's how to create one.
						</a>
					</p>
				</div> */}
			</div>
			<div className="hidden md:block mt-20 ">
				<Button
					onClick={() => {
						/* setStepPayment && setStepPayment(2); */
					}}
					className={clsx(
						'hidden md:flex gap-x-2 text-white text-base items-center'
					)}
				>
					<Icon src={IconsArrows.IconArrowLeft} className="w-6 h-6"></Icon>
					Go Back
				</Button>
			</div>
		</div>
	);
};
