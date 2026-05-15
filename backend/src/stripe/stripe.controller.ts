import { Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
  ) {}

  @Post('create-checkout-session')
  async createCheckoutSession() {
    const url =
      await this.stripeService.createCheckoutSession(
        'Test Event',
        100,
      );

    return {
      url,
    };
  }
}