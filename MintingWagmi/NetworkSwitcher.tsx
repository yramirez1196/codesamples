import clsx from 'clsx';
import { Button } from 'components/common/button';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export function NetworkSwitcher() {
	const { chain } = useNetwork();
	const { chains, isLoading, pendingChainId, switchNetwork } =
		useSwitchNetwork();

	if (!chain) return null;

	return (
		<div className="flex flex-col items-center gap-y-4 mt-4">
			<div>
				<p
					className={clsx(
						chain?.unsupported ? 'text-colors-red-600' : 'text-white',
						'font-bold'
					)}
				>
					{' '}
					Connected to {chain?.name ?? chain?.id}
					{chain?.unsupported && ' (unsupported)'}
				</p>
			</div>

			{switchNetwork && (
				<div className="">
					{chains.map((x) => {
						return x.id === chain?.id ? null : (
							<Button
								ButtonStyle="primaryTransparent"
								className="px-4 py-2"
								key={x.id}
								onClick={() => switchNetwork(x.id)}
							>
								Change to {x.name}
								{isLoading && x.id === pendingChainId && ' (switching)'}
							</Button>
						);
					})}
				</div>
			)}

			{/* 	<div>{error && error.message}</div> */}
		</div>
	);
}
