import assert from 'assert';
import { ASTVisitor, ValidationContext } from 'graphql';
// import { validate } from 'graphql/validation';
// import { buildASTSchema } from 'graphql/utilities/buildASTSchema';
import { validateSchemaDefinition } from 'graphql-schema-linter/lib/validator';
import { Configuration } from 'graphql-schema-linter/lib/configuration';
import { Schema } from 'graphql-schema-linter/lib/schema';
import { gql } from './utils';

type Rule = (context: ValidationContext) => ASTVisitor;
type LintError = {
  message: string,
  locations: {
    line: number,
    column: number,
  }[],
}

const DefaultSchema = gql`
  "Query root"
  type Query {
    "Field"
    a: String
  }
`;

export const expectFailsRule = (
  rule: Rule,
  schemaSDL: string,
  expectedErrors: LintError[] = [],
  configurationOptions = {}
) => {
  return expectFailsRuleWithConfiguration(
    rule,
    schemaSDL,
    configurationOptions,
    expectedErrors
  );
}

export const expectFailsRuleWithConfiguration = (
  rule: Rule,
  schemaSDL: string,
  configurationOptions: object,
  expectedErrors: LintError[] = []
) => {
  const errors = validateSchemaWithRule(rule, schemaSDL, configurationOptions);

  assert(errors.length > 0, "Expected rule to fail but didn't");

  assert.deepEqual(
    errors,
    expectedErrors.map((expectedError) => {
      return Object.assign(expectedError, {
        ruleName: rule.name
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, ''),
      });
    })
  );
}

export const expectPassesRule = (
  rule: Rule,
  schemaSDL: string,
  configurationOptions = {}
) => {
  expectPassesRuleWithConfiguration(rule, schemaSDL, configurationOptions);
}

export const expectPassesRuleWithConfiguration = (
  rule: Rule,
  schemaSDL: string,
  configurationOptions = {}
) => {
  const errors = validateSchemaWithRule(rule, schemaSDL, configurationOptions);

  assert(
    errors.length == 0,
    `Expected rule to pass but didn't got these errors:\n\n${errors.join('\n')}`
  );
}

const validateSchemaWithRule = (
  rule: Rule,
  schemaSDL: string,
  configurationOptions = {}
) => {
  const rules = [rule];
  const schema = new Schema(`${schemaSDL}${DefaultSchema}`, null);
  const configuration = new Configuration(schema, configurationOptions);
  const errors = validateSchemaDefinition(schema, rules, configuration);

  return errors;
}