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
          message:
            'Check the type of the `Entity.other` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
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
          message:
            'Check the type of the `Entity.other` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.',
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
          message:
            'Check the type of the `Entity.other` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.',
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
          message:
            'Check the type of the `Entity.other` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.',
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
          message:
            'Check the type of the `Entity.other` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.',
          locations: [{ line: 13, column: 11 }],
        },
      ],
    );
  });
});
