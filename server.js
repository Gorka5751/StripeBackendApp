const express = require('express');
const stripe = require('stripe')('sk_test_51NugGgAuabes3wfVJAmDbD37OyIlUDGpkaC70fF62oK0Q171OLWIhCVV2rdcXH5Wdxl69kQg7589wt5oCzXoaSz000jHJwHdrG');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());



// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

app.post('/payment-sheet', async (req, res) => {
  const amount = req.body.amount || 1199; 
  console.log("Precio recibido:", amount);
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2023-08-16'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51NugGgAuabes3wfVbGIbVlUTWPyFn27sRcxDaE9bLmDeiGDashfOhNDCP3dzgnqni6CTm8YsFxaXAV5z7MOt2qFs00ZKqNTgrc'
  });
});








app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
