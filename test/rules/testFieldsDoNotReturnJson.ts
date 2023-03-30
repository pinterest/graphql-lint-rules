import { FieldsDoNotReturnJson } from '../../src/rules/fieldsDoNotReturnJson';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('FieldsDoNotReturnJson rule', () => {
  it('allows non-JSON fields', () => {
    expectPassesRule(
      FieldsDoNotReturnJson,
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

  it('disallows straight JSON field', () => {
    expectFailsRule(
      FieldsDoNotReturnJson,
      gql`
        scalar ID
        scalar JSON
          @specifiedBy(
            url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf"
          )
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
          other: JSON
        }
      `,
      [
        {
          message: 'The field `Entity.other` is returning a JSON value.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
    );
  });

  it('disallows straight JSON field', () => {
    expectFailsRule(
      FieldsDoNotReturnJson,
      gql`
        scalar ID
        scalar JSON
          @specifiedBy(
            url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf"
          )
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
          other: JSON
        }
      `,
      [
        {
          message:
            'The field `Entity.other` is returning a JSON value.\nMore explanation: Test',
          locations: [{ line: 13, column: 11 }],
        },
      ],
      {
        rulesOptions: {
          'fields-do-not-return-json': {
            customMessage: 'Test',
          },
        },
      },
    );
  });

  it('disallows non-null JSON field', () => {
    expectFailsRule(
      FieldsDoNotReturnJson,
      gql`
        scalar ID
        scalar JSON
          @specifiedBy(
            url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf"
          )
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
          other: JSON!
        }
      `,
      [
        {
          message: 'The field `Entity.other` is returning a JSON value.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
    );
  });

  it('disallows straight JSON list field', () => {
    expectFailsRule(
      FieldsDoNotReturnJson,
      gql`
        scalar ID
        scalar JSON
          @specifiedBy(
            url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf"
          )
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
          other: [JSON]
        }
      `,
      [
        {
          message: 'The field `Entity.other` is returning a JSON value.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
    );
  });

  it('disallows non-null JSON list field', () => {
    expectFailsRule(
      FieldsDoNotReturnJson,
      gql`
        scalar ID
        scalar JSON
          @specifiedBy(
            url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf"
          )
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
          other: [JSON!]
        }
      `,
      [
        {
          message: 'The field `Entity.other` is returning a JSON value.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
    );
  });

  it('disallows non-null JSON non-null list field', () => {
    expectFailsRule(
      FieldsDoNotReturnJson,
      gql`
        scalar ID
        scalar JSON
          @specifiedBy(
            url: "http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf"
          )
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
          other: [JSON!]!
        }
      `,
      [
        {
          message: 'The field `Entity.other` is returning a JSON value.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
    );
  });
});
