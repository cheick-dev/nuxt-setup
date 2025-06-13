// server/api/verify-payment.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { reference } = body;

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    });

    const result = await res.json();

    if (!result.status) {
        throw createError({ statusCode: 400, statusMessage: "Paiement non valide" });
    }

    // Récupère le moyen de paiement
    const payment_method = result.data.channel; // Ex: 'card', 'bank', 'ussd', etc.
    const amount = result.data.amount;
    const buyer_email = result.data.customer.email;

    return {
        reference,
        payment_method,
        amount,
        buyer_email
    };
});
