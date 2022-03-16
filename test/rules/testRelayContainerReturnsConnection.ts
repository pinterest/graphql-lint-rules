import { RelayContainerReturnsConnection } from '../../src/rules/relayContainerReturnsConnection';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('RelayContainerReturnsConnection rule', () => {
  it('allows Connection Containers that return Connections', () => {
    expectPassesRule(
      RelayContainerReturnsConnection,
      gql`
        scalar ID

        scalar Cursor @serializationPrimitive(type: STRING)

        directive @allowNonNull on FIELD_DEFINITION

        enum PrimitiveType {
          """
          A type that represents a true or false value
          """
          BOOLEAN

          """
          An enumeration value, such as a JSON string
          """
          ENUM_VALUE
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer an INT or LIST primitive."
            )

          """
          A floating-point type, such as a JSON number
          """
          FLOAT

          """
          An integer type, such as a JSON number
          """
          INT

          """
          A list type, such as a JSON array
          """
          LIST
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer a standard GraphQLList type."
            )

          """
          A map type, such as a JSON object
          """
          MAP
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer a standard GraphQL object type."
            )

          """
          A type that represents the absence of data, such as a JSON null
          """
          NULL
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer a nullable field where possible."
            )

          """
          A string type, such as a JSON string
          """
          STRING
        }

        directive @serializationPrimitive(
          """
          The primitive type that should be used to serialize this scalar's value
          """
          type: PrimitiveType
        ) on SCALAR

        type PageInfo {
          a: String
        }

        interface Node {
          id: ID!
        }

        type Entity implements Node {
          id: ID!
          entityId: String!
        }

        type RandomEdge {
          "The item at the end of the edge"
          cursor: Cursor

          "The item at the end of the edge"
          node: Entity
        }

        type RandomConnection {
          "Contains the nodes in this connection"
          edges: [RandomEdge]

          "Pagination data for this connection"
          pageInfo: PageInfo! @allowNonNull
        }

        type RandomConnectionContainer {
          connection(
            "The cursor identifying the edge that all results should follow"
            after: Cursor
            "The number of edges to fetch at the start of the list"
            first: Int
          ): RandomConnection
        }
      `,
    );
  });

  it("disallows Connection Containers that doesn't return Connections", () => {
    expectFailsRule(
      RelayContainerReturnsConnection,
      gql`
        scalar ID

        scalar Cursor @serializationPrimitive(type: STRING)

        directive @allowNonNull on FIELD_DEFINITION

        enum PrimitiveType {
          """
          A type that represents a true or false value
          """
          BOOLEAN

          """
          An enumeration value, such as a JSON string
          """
          ENUM_VALUE
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer an INT or LIST primitive."
            )

          """
          A floating-point type, such as a JSON number
          """
          FLOAT

          """
          An integer type, such as a JSON number
          """
          INT

          """
          A list type, such as a JSON array
          """
          LIST
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer a standard GraphQLList type."
            )

          """
          A map type, such as a JSON object
          """
          MAP
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer a standard GraphQL object type."
            )

          """
          A type that represents the absence of data, such as a JSON null
          """
          NULL
            @deprecated(
              reason: "Not expected to be used, but present for future-proofing. Prefer a nullable field where possible."
            )

          """
          A string type, such as a JSON string
          """
          STRING
        }

        directive @serializationPrimitive(
          """
          The primitive type that should be used to serialize this scalar's value
          """
          type: PrimitiveType
        ) on SCALAR

        type PageInfo {
          a: String
        }

        interface Node {
          id: ID!
        }

        type Entity implements Node {
          id: ID!
          entityId: String!
        }

        type RandomEdge {
          "The item at the end of the edge"
          cursor: Cursor

          "The item at the end of the edge"
          node: Entity
        }

        type RandomConnection {
          "Contains the nodes in this connection"
          edges: [RandomEdge]

          "Pagination data for this connection"
          pageInfo: PageInfo! @allowNonNull
        }

        type RandomConnectionContainer {
          connection(
            "The cursor identifying the edge that all results should follow"
            after: Cursor
            "The number of edges to fetch at the start of the list"
            first: Int
          ): Entity
        }
      `,
      [
        {
          message:
            'The `RandomConnectionContainer` Container must return a Connection.',
          locations: [{ line: 98, column: 9 }],
        },
      ],
    );
  });
});
