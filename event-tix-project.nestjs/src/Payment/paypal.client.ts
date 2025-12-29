import * as paypal from '@paypal/checkout-server-sdk';

export function paypalClient() {
  const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET,
  );

  return new paypal.core.PayPalHttpClient(environment);
}


