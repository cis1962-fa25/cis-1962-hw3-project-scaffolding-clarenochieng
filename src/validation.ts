import { z } from 'zod';

const INVALID_TOPPINGS = ['spinach', 'mushroom', 'chicken', 'turkey'] as const;

export const PizzaSchema = z.object({
  size: z.number().positive('pizza size must be a positive number'),
  crust: z.enum(['stuffed', 'normal'], {
    message: 'crust must be either "stuffed" or "normal"',
  }),
  isDeepDish: z.boolean().optional().default(false),
  toppings: z
    .array(z.string())
    .optional()
    .refine(
      (toppings) => {
        if (!toppings) return true;
        return !toppings.some((topping) =>
          INVALID_TOPPINGS.includes(
            topping.toLowerCase() as (typeof INVALID_TOPPINGS)[number]
          )
        );
      },
      {
        message: `the following toppings are invalid: ${INVALID_TOPPINGS.join(', ')}.`,
      }
    ),
});

export type Pizza = z.infer<typeof PizzaSchema>;

export function validatePizza(input: unknown): {
  success: boolean;
  data?: Pizza;
  error?: string;
} {
  const result = PizzaSchema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    const errorMessages = result.error.issues.map((err) => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });

    return {
      success: false,
      error: errorMessages.join('; '),
    };
  }
}
