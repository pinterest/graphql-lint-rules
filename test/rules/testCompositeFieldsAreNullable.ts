import { CompositeFieldsAreNullable } from '../../src/rules/compositeFieldsAreNullable';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('CompositeFieldsAreNullable rule', () => {
  it('allows objects that have a nullable composite field', () => {
    expectPassesRule(
      CompositeFieldsAreNullable,
      gql`
        type ACompositeType {
          field: String
        }
        type HasNullComposite {
          field: ACompositeType
        }
      `,
      {
        rulesOptions: {
          'type-fields-sorted-alphabetically': {
            sortOrder: 'alphabetical',
          },
        },
      },
    );
  });

  it('catches objects that have a non-null composite field', () => {
    expectFailsRule(
      CompositeFieldsAreNullable,
      gql`
        type ACompositeType {
          field: String
        }
        type HasNonNullComposite {
          field: ACompositeType!
        }
      `,
      [
        {
          message:
            'The field `HasNonNullComposite.field` uses a composite type and should be nullable.',
          locations: [{ line: 6, column: 11 }],
        },
      ],
      {
        rulesOptions: {
          'type-fields-sorted-alphabetically': {
            sortOrder: 'alphabetical',
          },
        },
      },
    );
  });

  it('ignores scalar fields', () => {
    expectPassesRule(
      CompositeFieldsAreNullable,
      gql`
        type HasNonNullString {
          field: String!
        }
      `,
    );
  });

  it('ignores Relay violations', () => {
    expectPassesRule(
      CompositeFieldsAreNullable,
      gql`
        type MyRelayConnection {
          pageInfo: PageInfo
        }
        type PageInfo {
          hasNextPage: Boolean
        }
      `,
      {
        rulesOptions: {
          'type-fields-sorted-alphabetically': {
            sortOrder: 'alphabetical',
          },
        },
      },
    );
  });

  it('can be skipped with a directive', () => {
    expectPassesRule(
      CompositeFieldsAreNullable,
      gql`
        directive @allowNonNull on FIELD_DEFINITION

        type ACompositeType {
          field: String
        }
        type HasNonNullComposite {
          field: ACompositeType! @allowNonNull
        }
      `,
      {
        rulesOptions: {
          'type-fields-sorted-alphabetically': {
            sortOrder: 'alphabetical',
          },
        },
      },
    );
  });

  it('can be skipped by being added to the exceptions list', () => {
    expectPassesRule(
      CompositeFieldsAreNullable,
      gql`
        type ACompositeType {
          field: String
        }
        type HasNonNullComposite {
          field: ACompositeType!
        }
      `,
      {
        rulesOptions: {
          'composite-fields-are-nullable': {
            exceptions: ['ACompositeType'],
          },
        },
      },
    );
  });
});
