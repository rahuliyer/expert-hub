// app/lib/stripe.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function getProducts(productIds) {
  try {
    const products = await Promise.all(
      productIds.map(async (id) => {
        const product = await stripe.products.retrieve(id);
        const prices = await stripe.prices.list({ product: id });

        return {
          id: product.id,
          title: product.name,
          description: product.description,
          image: product.images[0],
          price: prices.data[0].unit_amount / 100, // Convert from cents to dollars
          instructor: product.metadata.instructor,
          duration: product.metadata.duration,
          level: product.metadata.level,
          category: product.metadata.category,
          priceId: prices.data[0].id // We'll need this for Stripe Checkout
        };
      })
    );

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}