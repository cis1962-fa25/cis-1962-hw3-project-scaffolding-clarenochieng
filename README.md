# Pizza Validator

A TypeScript package for validating pizza objects using Zod schema validation. This package provides both a programmatic API and a command-line interface (CLI) for validating pizza data.

## Installation

```bash
npm install cis-1962-hw3-project-scaffolding-clarenochieng
```

Or install globally to use the CLI:

```bash
npm install -g cis-1962-hw3-project-scaffolding-clarenochieng
```

## Pizza Schema

A valid pizza must have the following structure:

- **size** (required): A positive number representing the diameter in inches
- **crust** (required): A string that must be either `"stuffed"` or `"normal"`
- **isDeepDish** (optional): A boolean that defaults to `false` if not provided
- **toppings** (optional): An array of strings. The following toppings are **not allowed**:
  - spinach
  - mushroom
  - chicken
  - turkey

## Usage as a Dependency

### Import the validation function

```typescript
import { validatePizza } from 'cis-1962-hw3-project-scaffolding-clarenochieng';

// Example: Valid pizza
const validPizza = {
  size: 12,
  crust: 'normal',
  isDeepDish: false,
  toppings: ['pepperoni', 'bacon'],
};

const result = validatePizza(validPizza);

if (result.isPizza) {
  console.log('Valid pizza!', result.pizza);
} else {
  console.error('Invalid pizza:', result.errors);
}
```

### Return Type

The `validatePizza` function returns a discriminated union:

```typescript
type PizzaValidationResult = { isPizza: true; pizza: Pizza } | { isPizza: false; errors: string };
```

When `isPizza` is `true`, you can access the validated `pizza` object with full type safety. When `isPizza` is `false`, the `errors` field contains a string describing why the validation failed.

## CLI Usage

After installing globally, you can use the CLI to validate JSON files:

```bash
pizza-validator pizza.json
```

### Example: Valid Pizza

Create a file `valid-pizza.json`:

```json
{
  "size": 14,
  "crust": "stuffed",
  "isDeepDish": true,
  "toppings": ["pepperoni", "bacon"]
}
```

Run:

```bash
pizza-validator valid-pizza.json
```

Output:

```
✓ Valid pizza!
{
  "size": 14,
  "crust": "stuffed",
  "isDeepDish": true,
  "toppings": ["pepperoni", "bacon"]
}
```

### Example: Invalid Pizza

Create a file `invalid-pizza.json`:

```json
{
  "size": 12,
  "crust": "normal",
  "toppings": ["spinach", "mushroom"]
}
```

Run:

```bash
pizza-validator invalid-pizza.json
```

Output:

```
✗ Invalid pizza:
toppings: the following toppings are invalid: spinach, mushroom, chicken, turkey.
```

### Help

```bash
pizza-validator --help
```

## Development

### Building

```bash
npm run build
```

This compiles TypeScript source files from `src/` to `dist/`.

### Testing

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Linting

```bash
npm run lint
```

## License

ISC

## Author

Claren Ogira
