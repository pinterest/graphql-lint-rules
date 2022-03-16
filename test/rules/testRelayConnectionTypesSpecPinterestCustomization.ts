import { RelayConnectionTypesSpecPinterestCustomization } from '../../src/rules/relayConnectionTypesSpecPinterestCustomization';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('RelayConnectionTypesSpecPinterestCustomization rule', () => {
  it('allows Connections with the required "pageInfo" and "edges" fields', () => {
    expectPassesRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        type PageInfo {
          a: String
        }

        type Edge {
          a: String
        }

        type BetterConnection {
          pageInfo: PageInfo!
          edges: [Edge]
        }

        type AnotherConnection {
          pageInfo: PageInfo!
          edges: [Edge]!
        }

        type AnotherGoodConnection {
          pageInfo: PageInfo!
          edges: [Edge!]!
        }

        type AgainAnotherConnection {
          pageInfo: PageInfo!
          edges: [Edge!]
        }
      `,
    );
  });

  it('disallows Connections missing "edges" field', () => {
    expectFailsRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        type PageInfo {
          a: String
        }

        type Edge {
          a: String
        }

        type BetterConnection {
          pageInfo: PageInfo!
        }
      `,
      [
        {
          message:
            'Connection `BetterConnection` is missing the following field: edges.',
          locations: [{ line: 10, column: 9 }],
        },
      ],
    );
  });

  it('disallows Connections missing "pageInfo" field', () => {
    expectFailsRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        type PageInfo {
          a: String
        }

        type Edge {
          a: String
        }

        type BetterConnection {
          edges: [Edge]
        }
      `,
      [
        {
          message:
            'Connection `BetterConnection` is missing the following field: pageInfo.',
          locations: [{ line: 10, column: 9 }],
        },
      ],
    );
  });

  it('disallows types that end in Connection but that are not objects', () => {
    expectFailsRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        scalar ScalarConnection

        interface InterfaceConnection {
          a: String!
        }

        type F {
          a: String!
        }
        union UnionConnection = F

        enum EnumConnection {
          SOMETHING
        }

        input InputConnection {
          a: String!
        }
      `,
      [
        {
          locations: [
            {
              column: 9,
              line: 2,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `ScalarConnection` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 4,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `InterfaceConnection` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 11,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `UnionConnection` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 13,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `EnumConnection` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 17,
            },
          ],
          message:
            'Types that end in `Connection` must be an object type as per the relay spec. `InputConnection` is not an object type.',
        },
      ],
    );
  });

  it('disallows Connections that contains "edges" field with type different than a ListType', () => {
    expectFailsRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        type PageInfo {
          a: String
        }

        type Edge {
          a: String
        }

        type BetterConnection {
          pageInfo: PageInfo!
          edges: Edge
        }
      `,
      [
        {
          message:
            'The `BetterConnection.edges` field must return a list of edges not `NamedType`.',
          locations: [{ line: 10, column: 9 }],
        },
      ],
    );
  });

  it('disallows Connections that contains "edges" field without a list of Edges', () => {
    expectFailsRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        type PageInfo {
          a: String
        }

        enum SomethingEnum {
          SOMETHING
        }

        type BetterConnection {
          pageInfo: PageInfo!
          edges: [SomethingEnum]
        }
      `,
      [
        {
          message:
            "The `BetterConnection.edges` field type must be of a valid type, while `SomethingEnum` isn't.",
          locations: [{ line: 10, column: 9 }],
        },
      ],
    );
  });

  it('disallows Connections that contains "pageInfo" field with type different than non-nullable PageInfo', () => {
    expectFailsRule(
      RelayConnectionTypesSpecPinterestCustomization,
      gql`
        type PageInfo {
          a: String
        }

        enum SomethingEnum {
          SOMETHING
        }

        type Edge {
          a: String
        }

        type BetterConnection {
          pageInfo: SomethingEnum!
          edges: [Edge]
        }

        type OtherBetterConnection {
          pageInfo: PageInfo
          edges: [Edge]
        }
      `,
      [
        {
          message:
            'The `BetterConnection.pageInfo` field must return a non-null `PageInfo` object not `SomethingEnum!`.',
          locations: [{ line: 14, column: 9 }],
        },
        {
          message:
            'The `OtherBetterConnection.pageInfo` field must return a non-null `PageInfo` object not `PageInfo`.',
          locations: [{ line: 19, column: 9 }],
        },
      ],
    );
  });
});
