import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '../../node_modules/@stripe/stripe-js';
import { CheckoutForm } from 'components/stripe/CheckoutForm';
import { PaymentApiServices } from 'api/Payment';

import clsx from 'clsx';
import { PropsStepPayments } from 'interfaces';
export const StripeCard: React.FC<PropsStepPayments> = ({
	setStepPayment,
	
	TotalAmountWithoutGasUSD,

	id,
}) => {
	const [clientSecret, setClientSecret] = React.useState('');
	const [paymentIntent, setPaymentIntent] = React.useState('');
	const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
	const GassFee=10;
	const stripe = loadStripe(stripeKey || '');
	const appearance: {} = {
		theme: 'night',
		labels: 'floating',
		variables: {
			fontFamily: 'Ideal Sans, system-ui, sans-serif',
			spacingUnit: '4px',
			borderRadius: '4px',
			// See all possible variables below
		},
	};
	const options = {
		clientSecret: clientSecret,
		appearance: appearance,
	};

	const CalculatePrices = () => {
		if (
			TotalAmountWithoutGasUSD &&
			
		) {
			
			return {
				amount: TotalAmountWithoutGasUSD,
				
			};
		}
	};

/* 	React.useEffect(() => {
		CalculatePrices();
	}, []); */

	const GeneratePucharse = () => {
		PaymentApiServices.createPucharse({
			collectionId: id || '',
			paymentMethod: 'STRIPE',
			amount: CalculatePrices()?.amount || 0,
			
		})
			.then((response: any) => {
				console.log(response);
				/* 	console.log(response.data.payments[0].clientSecret);
				console.log(response.data.payments[0].paymentIntentId); */
				setClientSecret(response.data.payments[0].clientSecret);
				setPaymentIntent(response.data.payments[0].paymentIntentId);
			})
			.catch((error: any) => {
				console.log(error);
			});
	};

	React.useEffect(() => {
		GeneratePucharse();
	}, []);

	return (
		<div className={clsx('')}>
			 {clientSecret && paymentIntent && (
				<Elements options={options} stripe={stripe}>
					<CheckoutForm setStepPayment={setStepPayment} />
				</Elements>
			)} 
		</div>
	);
};
