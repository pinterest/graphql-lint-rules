
/** Copyright 2020-present, Pinterest, Inc.
 *
 * @generated with rollup
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */

'use strict';

require('./validation_error-a1229e5e.js');

const assertNever = (_x, message = 'Unrecognized type') => {
    throw new Error(message);
};
const isAllowedByDirective = (node, directiveName) => {
    return (!!node.directives &&
        node.directives.some((directive) => {
            return directive.name.value === directiveName;
        }));
};
const isNonNullTypeNode = (typeNode) => {
    return typeNode.kind === 'NonNullType';
};
const typeNodeKinds = new Set(['NamedType', 'ListType', 'NonNullType']);
const isTypeNode = (node) => {
    return node.hasOwnProperty('kind') && typeNodeKinds.has(node.kind);
};
const isNamedTypeNode = (node) => {
    return isTypeNode(node) && node.kind === 'NamedType';
};
const isNamedNode = (node) => {
    return node.hasOwnProperty('name');
};
const isGraphQLCompositeType = (type) => {
    const objectType = type;
    return (!!type &&
        !!objectType.astNode &&
        [
            'ObjectTypeDefinition',
            'InterfaceTypeDefinition',
            'UnionTypeDefinition',
        ].includes(objectType.astNode.kind));
};
const unwrapType = (typeNode) => {
    switch (typeNode.kind) {
        case 'NamedType':
            return typeNode;
        case 'NonNullType':
        case 'ListType':
            return unwrapType(typeNode.type);
        default:
            return assertNever();
    }
};
const unwrapAstNode = (node) => {
    return Array.isArray(node) ? node[0] : node;
};
const getNodeName = (node) => {
    return isNamedNode(node) ? node.name.value : undefined;
};

exports.getNodeName = getNodeName;
exports.isAllowedByDirective = isAllowedByDirective;
exports.isGraphQLCompositeType = isGraphQLCompositeType;
exports.isNamedTypeNode = isNamedTypeNode;
exports.isNonNullTypeNode = isNonNullTypeNode;
exports.unwrapAstNode = unwrapAstNode;
exports.unwrapType = unwrapType;
