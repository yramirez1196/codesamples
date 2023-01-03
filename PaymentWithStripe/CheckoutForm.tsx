import React from 'react';
import {
	useStripe,
	useElements,
	PaymentElement,
} from '@stripe/react-stripe-js';
import { PropsStepPayments } from 'interfaces';
import { Button } from 'components/common/button';
import clsx from 'clsx';

export const CheckoutForm: React.FC<PropsStepPayments> = ({
	setStepPayment,
}) => {
	/* 	const [message, setMessage] = React.useState(''); */
	const [isLoading, setIsLoading] = React.useState(false);
	const baseURL = process.env.NEXT_PUBLIC_URL;
	const stripe = useStripe();
	const elements = useElements();

	/* const redictUrl = `${baseURL}/payment/success`; */
	React.useEffect(() => {
		/* 	console.log(stripe); */
		if (!stripe) {
			return;
		}

		/* const clientSecret = new URLSearchParams(window.location.search).get(
			'payment_intent_client_secret'
		); */
	}, [stripe]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!stripe || !elements) {
			console.log('not loaded');
			return;
		}

		setIsLoading(true);

		const return_url = baseURL + '/payment/completed';
		console.log(return_url);

		const result = await stripe?.confirmPayment({
			elements,
			confirmParams: {
				return_url: return_url,
			},
		});

		console.log(result);
		if (result.error) {
			// Show error to your customer (for example, payment details incomplete)
			console.log(result.error);
		}

		setIsLoading(false);
	};

	return (
		<div>
			<form id="payment-form" onSubmit={handleSubmit} className="w-full">
				<PaymentElement />
				<div className="flex justify-center mt-8 md:mt-16 gap-x-8">
					<Button
						disabled={isLoading}
						type="button"
						ButtonStyle="primaryTransparent"
						typePadding="normal"
						className={clsx(' text-base ')}
						onClick={() => {
							setStepPayment && setStepPayment(2);
						}}
					>
						CANCEL
					</Button>
					<Button
						disabled={isLoading}
						ButtonStyle="primary"
						typePadding="normal"
						type="submit"
						className={clsx(' text-base ')}
					>
						CONFIRM
					</Button>
				</div>
			</form>
		</div>
	);
};
