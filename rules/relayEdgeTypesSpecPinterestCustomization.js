
/** Copyright 2020-present, Pinterest, Inc.
 *
 * @generated with rollup
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var validation_error = require('./validation_error-a1229e5e.js');
var printer = require('./printer-733cbc30.js');
var utils = require('./utils-147ff1ff.js');

const MANDATORY_FIELDS = ['cursor', 'node'];
function RelayEdgeTypesSpecPinterestCustomization(context) {
    const hasStringArgument = (argument) => {
        return argument.value.value == 'STRING';
    };
    const hasDirectiveWithStringArgument = (directive) => {
        var _a;
        const result = (_a = directive.arguments) === null || _a === void 0 ? void 0 : _a.some(hasStringArgument);
        return typeof result === 'boolean' ? result : false;
    };
    const hasStringType = (context, cursorTypeStr) => {
        var _a, _b;
        const returnsString = cursorTypeStr === 'String';
        if (!returnsString) {
            const schemaType = context.getSchema().getType(cursorTypeStr);
            const hasString = (_b = (_a = schemaType === null || schemaType === void 0 ? void 0 : schemaType.astNode) === null || _a === void 0 ? void 0 : _a.directives) === null || _b === void 0 ? void 0 : _b.some(hasDirectiveWithStringArgument);
            return hasString !== undefined ? hasString : false;
        }
        return returnsString;
    };
    const hasValidNodeType = (context, node) => {
        var _a;
        const allowedTypes = [
            'UnionTypeDefinition',
            'ObjectTypeDefinition',
            'ScalarTypeDefinition',
            'EnumTypeDefinition',
            'InterfaceTypeDefinition',
        ];
        const nodeFieldType = node === null || node === void 0 ? void 0 : node.type;
        const nodeFieldName = nodeFieldType
            ? utils.getNodeName(utils.unwrapType(nodeFieldType))
            : 'undefined';
        if (!nodeFieldName) {
            return false;
        }
        const schemaType = context.getSchema().getType(nodeFieldName);
        const validNodeType = allowedTypes.includes((schemaType === null || schemaType === void 0 ? void 0 : schemaType.astNode) ? (_a = schemaType === null || schemaType === void 0 ? void 0 : schemaType.astNode) === null || _a === void 0 ? void 0 : _a.kind : 'undefined');
        return validNodeType;
    };
    const ensureNameDoesNotEndWithEdge = (node) => {
        if (node.name.value.match(/Edge$/)) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-edge-types-spec-pinterest-customization', `Types that end in \`Edge\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`, [node]));
        }
    };
    const isValidEdge = (node) => {
        var _a;
        const typeName = node.name.value;
        if (!typeName.endsWith('Edge')) {
            return false;
        }
        const fieldNames = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map((field) => field.name.value);
        const missingFields = MANDATORY_FIELDS.filter((requiredField) => (fieldNames === null || fieldNames === void 0 ? void 0 : fieldNames.indexOf(requiredField)) === -1);
        if (missingFields.length) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-edge-types-spec-pinterest-customization', `Edge \`${typeName}\` is missing the following field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}.`, [node]));
            return false;
        }
        return true;
    };
    const getEdgeFields = (node) => {
        var _a, _b;
        const cursorField = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.find((field) => field.name.value == 'cursor');
        const nodeField = (_b = node.fields) === null || _b === void 0 ? void 0 : _b.find((field) => field.name.value == 'node');
        return [cursorField, nodeField];
    };
    const isValidCursorField = (cursorField, connectionNode) => {
        const typeName = connectionNode.name.value;
        let cursorFieldType = cursorField === null || cursorField === void 0 ? void 0 : cursorField.type;
        if ((cursorFieldType === null || cursorFieldType === void 0 ? void 0 : cursorFieldType.kind) == 'NonNullType') {
            cursorFieldType = cursorFieldType.type;
        }
        if ((cursorFieldType === null || cursorFieldType === void 0 ? void 0 : cursorFieldType.kind) != 'NamedType') {
            context.reportError(new validation_error.validation_error.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.cursor\` field must return a type that serializes as a String not \`${cursorFieldType}\`.`, [connectionNode]));
            return false;
        }
        const cursorTypeName = cursorFieldType
            ? printer.print(cursorFieldType)
            : 'undefined';
        if (!hasStringType(context, cursorTypeName)) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.cursor\` field must return a type that serializes as a String not \`${cursorTypeName}\`.`, [connectionNode]));
            return false;
        }
        return true;
    };
    const isValidNodeField = (nodeField, connectionNode) => {
        const typeName = connectionNode.name.value;
        let nodeFieldType = nodeField === null || nodeField === void 0 ? void 0 : nodeField.type;
        if ((nodeFieldType === null || nodeFieldType === void 0 ? void 0 : nodeFieldType.kind) == 'NonNullType') {
            nodeFieldType = nodeFieldType.type;
        }
        const nodeFieldName = nodeFieldType ? printer.print(nodeFieldType) : 'undefined';
        if ((nodeFieldType === null || nodeFieldType === void 0 ? void 0 : nodeFieldType.kind) == 'ListType') {
            context.reportError(new validation_error.validation_error.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.node\` field must return a NamedType or NonNullType, not ListType.`, [connectionNode]));
            return false;
        }
        if (!nodeField || !hasValidNodeType(context, nodeField)) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-edge-types-spec-pinterest-customization', `The \`${typeName}.node\` field type must be of a valid type, while \`${nodeFieldName}\` doesn\'t.`, [connectionNode]));
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
