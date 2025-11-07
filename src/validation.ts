/**
 * Pizza validation module using Zod schema validation.
 * Provides type-safe validation for pizza objects with a discriminated union return type.
 */

import { z } from 'zod';

/**
 * List of toppings that are not allowed on pizza.
 * These toppings are checked case-insensitively during validation.
 */
const INVALID_TOPPINGS = ['spinach', 'mushroom', 'chicken', 'turkey'] as const;

/**
 * Zod schema defining the structure and validation rules for a valid pizza.
 * This schema enforces:
 * - size: must be a positive number (diameter in inches)
 * - crust: must be either "stuffed" or "normal"
 * - isDeepDish: optional boolean, defaults to false if not provided
 * - toppings: optional array of strings, but cannot include invalid toppings
 */
export const PizzaSchema = z.object({
  // Pizza diameter in inches - must be a positive number
  size: z.number().positive('pizza size must be a positive number'),
  // Crust type - only "stuffed" or "normal" are valid options
  crust: z.enum(['stuffed', 'normal'], {
    message: 'crust must be either "stuffed" or "normal"',
  }),
  // Whether the pizza is deep dish - optional, defaults to false
  isDeepDish: z.boolean().optional().default(false),
  // Array of topping strings - optional, but cannot contain invalid toppings
  toppings: z
    .array(z.string())
    .optional()
    .refine(
      (toppings) => {
        // If no toppings provided, validation passes
        if (toppings === undefined) {
          return true;
        }
        // Check if any topping matches an invalid topping (case-insensitive)
        return !toppings.some((topping) =>
          INVALID_TOPPINGS.includes(topping.toLowerCase() as (typeof INVALID_TOPPINGS)[number]),
        );
      },
      {
        message: `the following toppings are invalid: ${INVALID_TOPPINGS.join(', ')}.`,
      },
    ),
});

/**
 * TypeScript type inferred from the PizzaSchema.
 * Represents a validated pizza object with all required and optional fields.
 */
export type Pizza = z.infer<typeof PizzaSchema>;

/**
 * Discriminated union type representing the result of pizza validation.
 * - If isPizza is true, the pizza field contains the validated pizza object
 * - If isPizza is false, the errors field contains a string describing validation failures
 */
export type PizzaValidationResult =
  | { isPizza: true; pizza: Pizza }
  | { isPizza: false; errors: string };

/**
 * Validates an unknown input to determine if it represents a valid pizza.
 *
 * Uses Zod's safeParse to validate the input against the PizzaSchema without throwing.
 * Returns a discriminated union that allows TypeScript to narrow the type based on
 * the isPizza flag.
 *
 * @param input - The unknown value to validate as a pizza
 * @returns A PizzaValidationResult discriminated union:
 *   - { isPizza: true, pizza: Pizza } if validation succeeds
 *   - { isPizza: false, errors: string } if validation fails, with a semicolon-separated
 *     list of error messages including field paths
 *
 * @example
 * ```typescript
 * const result = validatePizza({ size: 12, crust: 'normal' });
 * if (result.isPizza) {
 *   console.log(result.pizza.size); // TypeScript knows pizza exists here
 * } else {
 *   console.log(result.errors); // TypeScript knows errors exists here
 * }
 * ```
 */
export function validatePizza(input: unknown): PizzaValidationResult {
  // Use safeParse to avoid throwing exceptions - returns a result object instead
  const result = PizzaSchema.safeParse(input);

  if (result.success) {
    // Validation succeeded - return the validated pizza data
    return {
      isPizza: true,
      pizza: result.data,
    };
  } else {
    // Validation failed - collect all error messages with their field paths
    const errorMessages = result.error.issues.map((err) => {
      // Include the field path (e.g., "toppings.0") if available
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });

    // Join all error messages with semicolons for readability
    return {
      isPizza: false,
      errors: errorMessages.join('; '),
    };
  }
}
