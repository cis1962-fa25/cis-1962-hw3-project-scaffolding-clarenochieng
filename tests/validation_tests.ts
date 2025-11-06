import { validatePizza, PizzaSchema } from '../src/validation';

describe('pizza validation', () => {
  describe('validatePizza', () => {
    it('should validate a valid pizza with all required fields', () => {
      const validPizza = {
        size: 12,
        crust: 'normal',
      };

      const result = validatePizza(validPizza);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        size: 12,
        crust: 'normal',
        isDeepDish: false,
      });
      expect(result.error).toBeUndefined();
    });

    it('should validate a pizza with stuffed crust', () => {
      const validPizza = {
        size: 16,
        crust: 'stuffed',
      };

      const result = validatePizza(validPizza);

      expect(result.success).toBe(true);
      expect(result.data?.crust).toBe('stuffed');
    });

    it('should default isDeepDish to false when not provided', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
      };

      const result = validatePizza(pizza);

      expect(result.success).toBe(true);
      expect(result.data?.isDeepDish).toBe(false);
    });

    it('should accept isDeepDish when explicitly set to true', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        isDeepDish: true,
      };

      const result = validatePizza(pizza);

      expect(result.success).toBe(true);
      expect(result.data?.isDeepDish).toBe(true);
    });

    it('should accept isDeepDish when explicitly set to false', () => {
      const pizza = {
        size: 14,
        crust: 'normal',
        isDeepDish: false,
      };

      const result = validatePizza(pizza);

      expect(result.success).toBe(true);
      expect(result.data?.isDeepDish).toBe(false);
    });

    it('should validate a pizza with valid toppings', () => {
      const pizza = {
        size: 12,
        crust: 'normal',
        toppings: ['pepperoni', 'bacon', 'pineapple'],
      };

      const result = validatePizza(pizza);

      expect(result.success).toBe(true);
      expect(result.data?.toppings).toEqual([
        'pepperoni',
        'bacon',
        'pineapple',
      ]);
    });

    it('should validate a pizza with no toppings', () => {
      const pizza = {
        size: 12,
        crust: 'normal',
      };

      const result = validatePizza(pizza);

      expect(result.success).toBe(true);
      expect(result.data?.toppings).toBeUndefined();
    });

    it('should reject a pizza with negative size', () => {
      const invalidPizza = {
        size: -5,
        crust: 'normal',
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('pizza size must be a positive number');
    });

    it('should reject a pizza with zero size', () => {
      const invalidPizza = {
        size: 0,
        crust: 'normal',
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('pizza size must be a positive number');
    });

    it('should reject a pizza with invalid crust', () => {
      const invalidPizza = {
        size: 12,
        crust: 'thin',
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain(
        'crust must be either "stuffed" or "normal"'
      );
    });

    it('should reject a pizza with spinach topping', () => {
      const invalidPizza = {
        size: 12,
        crust: 'normal',
        toppings: ['pepperoni', 'spinach'],
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('spinach');
    });

    it('should reject a pizza with mushroom topping', () => {
      const invalidPizza = {
        size: 12,
        crust: 'normal',
        toppings: ['mushroom'],
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('mushroom');
    });

    it('should reject a pizza with chicken topping', () => {
      const invalidPizza = {
        size: 12,
        crust: 'normal',
        toppings: ['chicken'],
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('chicken');
    });

    it('should reject a pizza with turkey topping', () => {
      const invalidPizza = {
        size: 12,
        crust: 'normal',
        toppings: ['turkey'],
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('turkey');
    });

    it('should reject invalid toppings case-insensitively', () => {
      const invalidPizza = {
        size: 12,
        crust: 'normal',
        toppings: ['SPINACH', 'MuShRoOm'],
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toContain('spinach');
    });

    it('should reject a pizza missing size field', () => {
      const invalidPizza = {
        crust: 'normal',
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject a pizza missing crust field', () => {
      const invalidPizza = {
        size: 12,
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject a pizza with size as string', () => {
      const invalidPizza = {
        size: '12',
        crust: 'normal',
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject a pizza with invalid toppings array', () => {
      const invalidPizza = {
        size: 12,
        crust: 'normal',
        toppings: [123, 'pepperoni'],
      };

      const result = validatePizza(invalidPizza);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle completely invalid input', () => {
      const invalidInput = 'not a pizza';

      const result = validatePizza(invalidInput);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle null input', () => {
      const result = validatePizza(null);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle undefined input', () => {
      const result = validatePizza(undefined);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('PizzaSchema', () => {
    it('should parse valid pizza data correctly', () => {
      const pizzaData = {
        size: 14,
        crust: 'stuffed',
        isDeepDish: true,
        toppings: ['pepperoni', 'mushrooms'],
      };

      const result = PizzaSchema.safeParse(pizzaData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.size).toBe(14);
        expect(result.data.crust).toBe('stuffed');
        expect(result.data.isDeepDish).toBe(true);
        expect(result.data.toppings).toEqual(['pepperoni', 'mushrooms']);
      }
    });
  });
});

