import { RelayIdFieldType } from '../../src/rules/relayIdFieldType';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('RelayIdFieldType rule', () => {
  it('allows types that have no id field', () => {
    expectPassesRule(
      RelayIdFieldType,
      gql`
        type Entity {
          entityId: String!
        }
      `,
    );
  });

  it('allows types with a correct id field', () => {
    expectPassesRule(
      RelayIdFieldType,
      gql`
        type Entity {
          id: ID!
        }
      `,
    );
  });

  it('allows types to use ID on other fields', () => {
    expectPassesRule(
      RelayIdFieldType,
      gql`
        type Entity {
          myId: ID!
        }
      `,
    );
  });

  it('disallows types with a wrong id field type', () => {
    expectFailsRule(
      RelayIdFieldType,
      gql`
        type Entity {
          id: String!
        }
      `,
      [
        {
          message:
            'The "id" field on `Entity` must be a proper Relay ID field type, or renamed.',
          locations: [{ line: 2, column: 9 }],
        },
      ],
    );
  });

  it('disallows types with a non-nullable id field type', () => {
    expectFailsRule(
      RelayIdFieldType,
      gql`
        type Entity {
          id: ID
        }
      `,
      [
        {
          message:
            'The "id" field on `Entity` must be a proper Relay ID field type, or renamed.',
          locations: [{ line: 2, column: 9 }],
        },
      ],
    );
  });
});
