
/** Copyright 2020-present, Pinterest, Inc.
 *
 * @generated with rollup
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./index-44122349.js');
var utils = require('./utils-76fcebe9.js');
require('events');
require('child_process');
require('path');
require('fs');
require('util');
require('os');
require('assert');
require('module');

const MANDATORY_FIELDS = ['cursor', 'node'];
function RelayEdgeTypesSpecPinterestCustomization(context) {
    const hasStringArgument = (argument) => {
        return argument.value.value == 'STRING';
    };
    const hasDirectiveWithStringArgument = (directive) => {
        const result = directive.arguments?.some(hasStringArgument);
        return typeof result === 'boolean' ? result : false;
    };
    const hasStringType = (context, cursorTypeStr) => {
        const returnsString = cursorTypeStr === 'String';
        if (!returnsString) {
            const schemaType = context.getSchema().getType(cursorTypeStr);
            const hasString = schemaType?.astNode?.directives?.some(hasDirectiveWithStringArgument);
            return hasString !== undefined ? hasString : false;
        }
        return returnsString;
    };
    const hasValidNodeType = (context, node) => {
        const allowedTypes = [
            'UnionTypeDefinition',
            'ObjectTypeDefinition',
            'ScalarTypeDefinition',
            'EnumTypeDefinition',
            'InterfaceTypeDefinition',
        ];
        const nodeFieldType = node?.type;
        const nodeFieldName = nodeFieldType
            ? utils.getNodeName(utils.unwrapType(nodeFieldType))
            : 'undefined';
        if (!nodeFieldName) {
            return false;
        }
        const schemaType = context.getSchema().getType(nodeFieldName);
        const validNodeType = allowedTypes.includes(schemaType?.astNode ? schemaType?.astNode?.kind : 'undefined');
        return validNodeType;
    };
    const ensureNameDoesNotEndWithEdge = (node) => {
        if (node.name.value.match(/Edge$/)) {
            context.reportError(new index.ValidationError('relay-edge-types-spec-pinterest-customization', `Types that end in \`Edge\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`, [node]));
        }
    };
    const isValidEdge = (node) => {
        const typeName = node.name.value;
        if (!typeName.endsWith('Edge')) {
            return false;
        }
        const fieldNames = node.fields?.map((field) => field.name.value);
        const missingFields = MANDATORY_FIELDS.filter((requiredField) => fieldNames?.indexOf(requiredField) === -1);
        if (missingFields.length) {
            context.reportError(new index.ValidationError('relay-edge-types-spec-pinterest-customization', `Edge \`${typeName}\` is missing the following field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}.`, [node]));
            return false;
        }
        return true;
    };
    const getEdgeFields = (node) => {
        const cursorField = node.fields?.find((field) => field.name.value == 'cursor');
        const nodeField = node.fields?.find((field) => field.name.value == 'node');
        return [cursorField, nodeField];
    };
    const isValidCursorField = (cursorField, connectionNode) => {
        const typeName = connectionNode.name.value;
        let cursorFieldType = cursorField?.type;
        if (cursorFieldType?.kind == 'NonNullType') {
            cursorFieldType = cursorFieldType.type;
        }
        if (cursorFieldType?.kind != 'NamedType') {
            context.reportError(new index.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.cursor\` field must return a type that serializes as a String not \`${cursorFieldType}\`.`, [connectionNode]));
            return false;
        }
        const cursorTypeName = cursorFieldType
            ? index.print(cursorFieldType)
            : 'undefined';
        if (!hasStringType(context, cursorTypeName)) {
            context.reportError(new index.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.cursor\` field must return a type that serializes as a String not \`${cursorTypeName}\`.`, [connectionNode]));
            return false;
        }
        return true;
    };
    const isValidNodeField = (nodeField, connectionNode) => {
        const typeName = connectionNode.name.value;
        let nodeFieldType = nodeField?.type;
        if (nodeFieldType?.kind == 'NonNullType') {
            nodeFieldType = nodeFieldType.type;
        }
        const nodeFieldName = nodeFieldType ? index.print(nodeFieldType) : 'undefined';
        if (nodeFieldType?.kind == 'ListType') {
            context.reportError(new index.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.node\` field must return a NamedType or NonNullType, not ListType.`, [connectionNode]));
            return false;
        }
        if (!nodeField || !hasValidNodeType(context, nodeField)) {
            context.reportError(new index.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.node\` field type must be of a valid type, while \`${nodeFieldName}\` doesn\'t.`, [connectionNode]));
            return false;
        }
        return true;
    };
    return {
        ScalarTypeDefinition: ensureNameDoesNotEndWithEdge,
        InterfaceTypeDefinition: ensureNameDoesNotEndWithEdge,
        UnionTypeDefinition: ensureNameDoesNotEndWithEdge,
        EnumTypeDefinition: ensureNameDoesNotEndWithEdge,
        InputObjectTypeDefinition: ensureNameDoesNotEndWithEdge,
        ObjectTypeDefinition(node) {
            let validationResult = isValidEdge(node);
            if (!validationResult) {
                return;
            }
            const [cursorNode, nodeNode] = getEdgeFields(node);
            validationResult = cursorNode
                ? isValidCursorField(cursorNode, node)
                : false;
            if (!validationResult) {
                return;
            }
            validationResult = nodeNode ? isValidNodeField(nodeNode, node) : false;
            if (!validationResult) {
                return;
            }
        },
    };
}

exports.RelayEdgeTypesSpecPinterestCustomization = RelayEdgeTypesSpecPinterestCustomization;
