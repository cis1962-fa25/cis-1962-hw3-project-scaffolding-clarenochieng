#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * CLI entry point for the pizza validation package.
 * Reads a JSON file from command-line arguments and validates it as a pizza.
 *
 * Usage:
 *   pizza-validator <json-file>
 *   pizza-validator --help
 *
 * Exit codes:
 *   0 - Success (valid pizza)
 *   1 - Error (invalid pizza, file not found, or invalid JSON)
 */

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { validatePizza } from './validation.js';

/**
 * Main CLI function that processes command-line arguments and validates pizza files.
 * Handles file reading, JSON parsing, pizza validation, and error reporting.
 */
function main(): void {
  // Parse command-line arguments using Node.js built-in parseArgs utility
  const args = parseArgs({
    args: process.argv.slice(2), // Skip 'node' and script path
    options: {
      help: {
        type: 'boolean',
        short: 'h', // Allow both --help and -h flags
      },
    },
    allowPositionals: true, // Allow positional arguments
  });

  // Display help message if --help flag is used or no file path is provided
  if (args.values.help === true || args.positionals.length === 0) {
    console.log('usage: pizza-validator <json-file>');
    console.log('validates a JSON file to check if it contains a valid pizza.');
    console.log('\noptions:');
    console.log('  -h, --help    show this help message');
    process.exit(0);
  }

  // Get the file path from positional arguments
  const filePath = args.positionals[0];

  try {
    // Read the JSON file synchronously
    const fileContent = readFileSync(filePath, 'utf-8');
    // Parse the JSON content into a JavaScript object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonData = JSON.parse(fileContent);

    // Validate the parsed data as a pizza using the validation function
    const result = validatePizza(jsonData);

    if (result.isPizza) {
      // Pizza is valid - print success message and formatted pizza object
      console.log('✓ Valid pizza!');
      console.log(JSON.stringify(result.pizza, null, 2));
      process.exit(0);
    } else {
      // Pizza is invalid - print error message with validation errors
      console.error('✗ Invalid pizza:');
      console.error(result.errors);
      process.exit(1);
    }
  } catch (error) {
    // Handle various error types that can occur during file operations
    if (error instanceof Error) {
      // File not found error
      if ('code' in error && error.code === 'ENOENT') {
        console.error(`Error: File "${filePath}" not found.`);
      } else if (error instanceof SyntaxError) {
        // Invalid JSON syntax error
        console.error(`Error: Invalid JSON in file "${filePath}".`);
        console.error(error.message);
      } else {
        // Other file reading errors (permissions, etc.)
        console.error(`Error reading file "${filePath}":`);
        console.error(error.message);
      }
    } else {
      // Fallback for unknown error types
      console.error(`Unknown error: ${String(error)}`);
    }
    process.exit(1);
  }
}

// Run the CLI when this file is executed directly
main();
