import assert from 'assert';
import { ASTVisitor, ValidationContext } from 'graphql';
import { validateSchemaDefinition } from 'graphql-schema-linter/lib/validator';
import { Configuration } from 'graphql-schema-linter/lib/configuration';
import { Schema } from 'graphql-schema-linter/lib/schema';
import { gql } from './utils';

type Rule = (context: ValidationContext) => ASTVisitor;
type RuleWithConfigurations = (
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  configurations: any,
  context: ValidationContext,
) => ASTVisitor;
type LintError = {
  message: string;
  locations: {
    line: number;
    column: number;
  }[];
};

const DefaultSchema = gql`
  "Query root"
  type Query {
    "Field"
    a: String
  }
`;

export const expectFailsRule = (
  rule: Rule | RuleWithConfigurations,
  schemaSDL: string,
  expectedErrors: LintError[] = [],
  configurationOptions = {},
): void => {
  return expectFailsRuleWithConfiguration(
    rule,
    schemaSDL,
    configurationOptions,
    expectedErrors,
  );
};

export const expectFailsRuleWithConfiguration = (
  rule: Rule | RuleWithConfigurations,
  schemaSDL: string,
  configurationOptions: Record<string, unknown>,
  expectedErrors: LintError[] = [],
): void => {
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
    }),
  );
};

export const expectPassesRule = (
  rule: Rule | RuleWithConfigurations,
  schemaSDL: string,
  configurationOptions = {},
): void => {
  expectPassesRuleWithConfiguration(rule, schemaSDL, configurationOptions);
};

export const expectPassesRuleWithConfiguration = (
  rule: Rule | RuleWithConfigurations,
  schemaSDL: string,
  configurationOptions = {},
): void => {
  const errors = validateSchemaWithRule(rule, schemaSDL, configurationOptions);

  assert(
    errors.length == 0,
    `Expected rule to pass but didn't got these errors:\n\n${errors.join(
      '\n',
    )}`,
  );
};

const validateSchemaWithRule = (
  rule: Rule | RuleWithConfigurations,
  schemaSDL: string,
  configurationOptions = {},
) => {
  const rules = [rule];
  const schema = new Schema(`${schemaSDL}${DefaultSchema}`, null);
  const configuration = new Configuration(schema, configurationOptions);
  const errors = validateSchemaDefinition(schema, rules, configuration);

  return errors;
};
