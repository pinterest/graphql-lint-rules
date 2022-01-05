import { FieldsCamelCasedOptionalStartingUnderscore } from '../../src/rules/fieldsCamelCasedOptionalStartingUnderscore';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('FieldsMatchRegex rule', () => {
  it('allows camelCased names', () => {
    expectPassesRule(
      FieldsCamelCasedOptionalStartingUnderscore,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
      `,
    );
  });

  it('allows field names that starts with underscore', () => {
    expectPassesRule(
      FieldsCamelCasedOptionalStartingUnderscore,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          _entityId: String!
          _9: String!
        }
      `,
    );
  });

  it('disallows field names that have underscores anywhere other than the start of the name', () => {
    expectFailsRule(
      FieldsCamelCasedOptionalStartingUnderscore,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entity_Id: String
          other_: String
        }
      `,
      [
        {
          message:
            'The field `Entity.entity_Id` is not camel-cased or starts with underscore.',
          locations: [{ line: 8, column: 11 }],
        },
        {
          message:
            'The field `Entity.other_` is not camel-cased or starts with underscore.',
          locations: [{ line: 9, column: 11 }],
        },
      ],
    );
  });
});
