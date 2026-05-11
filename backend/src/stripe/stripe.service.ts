import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: any;

  constructor() {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY as string,
      {
        apiVersion: '2026-04-22.dahlia',
      },
    );
  }

  async createCheckoutSession() {
    const session =
      await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: 'eur',

              product_data: {
                name: 'Biglietto Evento',
              },

              unit_amount: 1999,
            },

            quantity: 1,
          },
        ],

        mode: 'payment',

        success_url:
          'http://localhost:3000?success=true',

        cancel_url:
          'http://localhost:3000?canceled=true',
      });

    return session.url;
  }
}