import {
  ASTNode,
  DirectiveNode,
  GraphQLCompositeType,
  GraphQLType,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectFieldNode,
  TypeDefinitionNode,
  TypeNode,
} from 'graphql';

export { ValidationError } from 'graphql-schema-linter/lib/validation_error';

declare type Configuration = typeof import('graphql-schema-linter/lib/configuration');

export { Configuration };

const assertNever = (_x: never, message = 'Unrecognized type'): never => {
  throw new Error(message);
};

const isAllowedByDirective = (
  node: {
    directives?: readonly DirectiveNode[];
  },
  directiveName: string,
): boolean => {
  return (
    !!node.directives &&
    node.directives.some((directive) => {
      return directive.name.value === directiveName;
    })
  );
};

const isNonNullTypeNode = (typeNode: TypeNode): typeNode is NonNullTypeNode => {
  return typeNode.kind === 'NonNullType';
};

const typeNodeKinds = new Set(['NamedType', 'ListType', 'NonNullType']);
const isTypeNode = (node: ASTNode): node is TypeNode => {
  return node.hasOwnProperty('kind') && typeNodeKinds.has(node.kind);
};

const isNamedTypeNode = (node: ASTNode): node is NamedTypeNode => {
  return isTypeNode(node) && node.kind === 'NamedType';
};

const isNamedNode = (
  node: ASTNode,
): node is NamedTypeNode | TypeDefinitionNode | ObjectFieldNode => {
  return node.hasOwnProperty('name');
};

const isGraphQLCompositeType = (
  type?: GraphQLType,
): type is GraphQLCompositeType => {
  const objectType = type as GraphQLCompositeType;
  return (
    !!type &&
    !!objectType.astNode &&
    [
      'ObjectTypeDefinition',
      'InterfaceTypeDefinition',
      'UnionTypeDefinition',
    ].includes(objectType.astNode.kind)
  );
};

const unwrapType = (typeNode: TypeNode): NamedTypeNode => {
  switch (typeNode.kind) {
    case 'NamedType':
      return typeNode;
    case 'NonNullType':
    case 'ListType':
      return unwrapType(typeNode.type);
    default:
      return assertNever(typeNode);
  }
};

const unwrapAstNode = (
  node: ASTNode | readonly ASTNode[],
): ASTNode | undefined => {
  return Array.isArray(node) ? node[0] : node;
};

const getNodeName = (node: ASTNode): string | undefined => {
  return isNamedNode(node) ? node.name.value : undefined;
};

export {
  assertNever,
  getNodeName,
  isNonNullTypeNode,
  isTypeNode,
  isNamedTypeNode,
  isGraphQLCompositeType,
  isAllowedByDirective,
  unwrapType,
  unwrapAstNode,
};
