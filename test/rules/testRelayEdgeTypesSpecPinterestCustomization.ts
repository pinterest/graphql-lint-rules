import { RelayEdgeTypesSpecPinterestCustomization } from '../../src/rules/relayEdgeTypesSpecPinterestCustomization';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('RelayEdgeTypesSpecPinterestCustomization rule', () => {
  it('allows Edges with the required "cursor" and "node" fields', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar Cursor @serializationPrimitive(type: STRING)
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: Cursor

          "The item at the end of the edge"
          node: Entity
        }
      `,
    );
  });

  it('disallows Edges missing "node" field', () => {
    expectFailsRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar Cursor @serializationPrimitive(type: STRING)
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: Cursor
        }
      `,
      [
        {
          message:
            'Edge `V3SearchUsersWithStoriesDataEdge` is missing the following field: node.',
          locations: [{ line: 70, column: 9 }],
        },
      ],
    );
  });

  it('disallows Edges missing "cursor" field', () => {
    expectFailsRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar Cursor @serializationPrimitive(type: STRING)
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          node: Entity
        }
      `,
      [
        {
          message:
            'Edge `V3SearchUsersWithStoriesDataEdge` is missing the following field: cursor.',
          locations: [{ line: 70, column: 9 }],
        },
      ],
    );
  });

  it('disallows types that end in Edge but that are not objects', () => {
    expectFailsRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ScalarEdge

        interface InterfaceEdge {
          a: String!
        }

        type F {
          a: String!
        }
        union UnionEdge = F

        enum EnumEdge {
          SOMETHING
        }

        input InputEdge {
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
            'Types that end in `Edge` must be an object type as per the relay spec. `ScalarEdge` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 4,
            },
          ],
          message:
            'Types that end in `Edge` must be an object type as per the relay spec. `InterfaceEdge` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 11,
            },
          ],
          message:
            'Types that end in `Edge` must be an object type as per the relay spec. `UnionEdge` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 13,
            },
          ],
          message:
            'Types that end in `Edge` must be an object type as per the relay spec. `EnumEdge` is not an object type.',
        },
        {
          locations: [
            {
              column: 9,
              line: 17,
            },
          ],
          message:
            'Types that end in `Edge` must be an object type as per the relay spec. `InputEdge` is not an object type.',
        },
      ],
    );
  });

  it('disallows Edges that contains "cursor" field with type that doesn\'t serializes as a String', () => {
    expectFailsRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar Cursor @serializationPrimitive(type: STRING)
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: Entity

          "The item at the end of the edge"
          node: Entity
        }
      `,
      [
        {
          message:
            'The `V3SearchUsersWithStoriesDataEdge.cursor` field must return a type that serializes as a String not `Entity`.',
          locations: [{ line: 70, column: 9 }],
        },
      ],
    );
  });

  it('allows Edges that contains "cursor" field with type that is a String', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }

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
        scalar Cursor @serializationPrimitive(type: STRING)
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: Cursor

          "The item at the end of the edge"
          node: Entity
        }
      `,
    );
  });

  it('allows Edges that contains "cursor" field with type that serializes as a String', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        type Entity implements Node {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: Entity
        }
      `,
    );
  });

  it('disallows Edges that contains "node" field with invalid type ListType', () => {
    expectFailsRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        type ListEntity {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: [ListEntity]
        }
      `,
      [
        {
          message:
            'The `V3SearchUsersWithStoriesDataEdge.node` field must return a NamedType or NonNullType, not ListType.',
          locations: [{ line: 69, column: 9 }],
        },
      ],
    );
  });

  it('allows Edges that contains "node" field with valid type NamedType ObjectTypeDefinition', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        type Entity {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: Entity
        }
      `,
    );
  });

  it('allows Edges that contains "node" field with valid type NamedType UnionTypeDefinition', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        type Entity {
          id: ID!
          entityId: String!
        }
        type Entity2 {
          id: ID!
          entityId: String!
        }
        union EntityUnion = Entity | Entity2
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: EntityUnion
        }
      `,
    );
  });

  it('allows Edges that contains "node" field with valid type NamedType ScalarTypeDefinition', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar AccountType @serializationPrimitive(type: STRING)
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: AccountType
        }
      `,
    );
  });

  it('allows Edges that contains "node" field with valid type NamedType EnumTypeDefinition', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar AccountType @serializationPrimitive(type: STRING)
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: PrimitiveType
        }
      `,
    );
  });

  it('allows Edges that contains "node" field with valid type NamedType InterfaceTypeDefinition', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        scalar AccountType @serializationPrimitive(type: STRING)
        type V3SearchUsersWithStoriesDataEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: Node
        }
      `,
    );
  });

  it('allows Edges that contains "node" field with valid type NonNullType', () => {
    expectPassesRule(
      RelayEdgeTypesSpecPinterestCustomization,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
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
        directive @allowNonNull on FIELD_DEFINITION
        directive @serializationPrimitive(
          """
          The primitive type that should be used to serialize this scalar's value
          """
          type: PrimitiveType
        ) on SCALAR
        type NonNullEntity {
          id: ID!
          entityId: String!
        }
        type V3SearchUsersWithStoriesDataNonNullEdge {
          "The item at the end of the edge"
          cursor: String

          "The item at the end of the edge"
          node: NonNullEntity! @allowNonNull
        }
      `,
    );
  });
});
