import { NodesContainEntityId } from '../../src/rules/nodesContainEntityId';

import { gql } from '../utils';

import { expectPassesRule, expectFailsRule } from '../assertions';

describe('NodesContainEntityId rule', () => {
  it('allows Node types that have a non-nullable entityId string', () => {
    expectPassesRule(
      NodesContainEntityId,
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

  it('disallows Node types where entityId is nullable', () => {
    expectFailsRule(
      NodesContainEntityId,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: String
        }
      `,
      [
        {
          message:
            'The Node type `Entity` must have a non-nullable "entityId" string.',
          locations: [{ line: 6, column: 9 }],
        },
      ],
    );
  });

  it('disallows Node types where entityId is not a string', () => {
    expectFailsRule(
      NodesContainEntityId,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
          entityId: Int!
        }
      `,
      [
        {
          message:
            'The Node type `Entity` must have a non-nullable "entityId" string.',
          locations: [{ line: 6, column: 9 }],
        },
      ],
    );
  });

  it('disallows Node types where entityId is missing', () => {
    expectFailsRule(
      NodesContainEntityId,
      gql`
        scalar ID
        interface Node {
          id: ID!
        }
        type Entity implements Node {
          id: ID!
        }
      `,
      [
        {
          message:
            'The Node type `Entity` must have a non-nullable "entityId" string.',
          locations: [{ line: 6, column: 9 }],
        },
      ],
    );
  });

  it('skips entities that do not implement Node', () => {
    expectPassesRule(
      NodesContainEntityId,
      gql`
        type Entity {
          entityId: Int
        }
      `,
    );
  });
});
