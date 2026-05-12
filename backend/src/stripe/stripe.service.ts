import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY || '',
      {
        apiVersion: '2025-04-30.basil',
      },
    );
  }

  async createCheckoutSession(
    eventTitle: string,
    price: number,
  ) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: eventTitle,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url:
        'http://localhost:3000/success',
      cancel_url:
        'http://localhost:3000/cancel',
    });
  }
}