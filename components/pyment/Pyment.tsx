// Payment.jsx
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import DropIn from "braintree-web-drop-in-react";

interface PaymentProps {
    amount: number; // Total amount to charge
    bookingId: string; // Current booking ID
    userId: string; // Current user ID
    seasonId?: string; // Optional season ID
}
interface Dropin {
    requestPaymentMethod: () => Promise<{ nonce: string }>;
}
const Payment = ({ amount, bookingId, userId, }: PaymentProps) => {
    const [clientToken, setClientToken] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null); // 'paypal' or 'dropin'
    const [instance, setInstance] = useState<Dropin | null>(null); 
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState("");
    const [success, setSuccess] = useState(false);

    // Fetch client token from your backend
    useEffect(() => {
        const fetchClientToken = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/client-token`);
                const data = await response.json();
                setClientToken(data.clientToken);
            } catch (err) {
                setErrors("Failed to load payment options" + (err ? `: ${err}` : ""));
            }
        };
        fetchClientToken();
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePaymentMethodSelect = (method: any) => {
        setPaymentMethod(method);
        setErrors("");
    };

    const handleDropInPayment = async () => {
        setLoading(true);
        try {
            // const { nonce } = await instance.requestPaymentMethod();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    paymentMethodNonce: clientToken,
                    bookingId,
                    userId,
                    
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setErrors(data.error || 'Payment failed');
            }
        } catch (err) {
            setErrors(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="payment-success">
                <h2>Payment Successful!</h2>
                <p>Thank you for your payment.</p>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <h2>Payment Options</h2>
            <p>Total Amount: ${amount}</p>

            <div className="payment-method-selector">
                <button
                    onClick={() => handlePaymentMethodSelect('paypal')}
                    className={paymentMethod === 'paypal' ? 'active' : ''}
                >
                    PayPal
                </button>
                <button
                    onClick={() => handlePaymentMethodSelect('dropin')}
                    className={paymentMethod === 'dropin' ? 'active' : ''}
                >
                    Credit/Debit Card
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {paymentMethod === 'paypal' && clientToken && (
                <div className="paypal-container">
                    <PayPalScriptProvider
                        options={{
                            clientId: "YOUR_CLIENT_ID", 
                            "data-client-token": clientToken,
                            components: "buttons",
                            currency_code: "USD",
                            intent: "capture",
                            vault: false,
                        }}
                    >
                        <PayPalButtons
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            createOrder={(data, actions: any) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: "USD",
                                                value: amount.toString(),
                                            }
                                        },
                                    ],
                                });
                            }}
                            onApprove={async () => {

                                setLoading(true);
                                try {
                                    // const details = await actions.order.capture();

                                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            amount,
                                            paymentMethodNonce: clientToken,
                                            bookingId,
                                            userId,
                                          
                                        }),
                                    });

                                    const result = await response.json();

                                    if (result.success) {
                                        setSuccess(true);
                                    } else {
                                        setErrors(result.error || 'Payment failed');
                                    }
                                } catch (err) {
                                    setErrors(err instanceof Error ? err.message : String(err));
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            onError={(err) => {
                                setErrors(err.toString());
                            }}
                        />
                    </PayPalScriptProvider>
                </div>
            )}

            {paymentMethod === 'dropin' && clientToken && (
                <div className="dropin-container">
                    <DropIn
                        options={{
                            authorization: clientToken,
                            paypal: {
                                flow: 'vault'
                            },
                            venmo: true, // if you want to support Venmo
                        }}
                        onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                        onClick={handleDropInPayment}
                        disabled={!instance || loading}
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Payment;
