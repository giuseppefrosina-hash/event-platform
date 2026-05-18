import { Injectable } from '@nestjs/common';
const Stripe = require('stripe');

@Injectable()
export class StripeService {
  private stripe: any;

  constructor() {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY || '',
      {
        apiVersion: '2026-04-22.dahlia',
      },
    );
  }

  async createCheckoutSession(
    eventTitle: string,
    amount: number,
  ) {
    const session =
      await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: 'eur',

              product_data: {
                name: eventTitle,
              },

              unit_amount: amount * 100,
            },

            quantity: 1,
          },
        ],

        mode: 'payment',

        success_url: 'https://google.com',
        cancel_url: 'https://google.com',
      });

    return session.url;
  }
}