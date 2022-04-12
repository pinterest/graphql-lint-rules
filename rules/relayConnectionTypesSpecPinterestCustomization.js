
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

const MANDATORY_FIELDS = ['pageInfo', 'edges'];
function RelayConnectionTypesSpecPinterestCustomization(context) {
    const ensureNameDoesNotEndWithConnection = (node) => {
        if (node.name.value.match(/Connection$/)) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-connection-types-spec-pinterest-customization', `Types that end in \`Connection\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`, [node]));
        }
    };
    const isValidConnection = (node) => {
        var _a;
        const typeName = node.name.value;
        if (!typeName.endsWith('Connection')) {
            return false;
        }
        const fieldNames = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map((field) => field.name.value);
        const missingFields = MANDATORY_FIELDS.filter((requiredField) => (fieldNames === null || fieldNames === void 0 ? void 0 : fieldNames.indexOf(requiredField)) === -1);
        if (missingFields.length) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-connection-types-spec-pinterest-customization', `Connection \`${typeName}\` is missing the following field${missingFields.length > 1 ? 's' : ''}: ${missingFields.join(', ')}.`, [node]));
            return false;
        }
        return true;
    };
    const getConnectionFields = (node) => {
        const edgesField = node.fields
            ? node.fields.find((field) => field.name.value == 'edges')
            : undefined;
        const pageInfoField = node.fields
            ? node.fields.find((field) => field.name.value == 'pageInfo')
            : undefined;
        return [edgesField, pageInfoField];
    };
    const isValidEdgesField = (edgesField, connectionNode) => {
        const typeName = connectionNode.name.value;
        let edgesFieldType = edgesField === null || edgesField === void 0 ? void 0 : edgesField.type;
        if ((edgesFieldType === null || edgesFieldType === void 0 ? void 0 : edgesFieldType.kind) == 'NonNullType') {
            edgesFieldType = edgesFieldType.type;
        }
        if ((edgesFieldType === null || edgesFieldType === void 0 ? void 0 : edgesFieldType.kind) != 'ListType') {
            context.reportError(new validation_error.validation_error.ValidationError('relay-connection-types-spec-pinterest-customization', `The \`${typeName}.edges\` field must return a list of edges not \`${edgesFieldType === null || edgesFieldType === void 0 ? void 0 : edgesFieldType.kind}\`.`, [connectionNode]));
            return false;
        }
        const edgesFieldName = edgesFieldType
            ? utils.getNodeName(utils.unwrapType(edgesFieldType))
            : 'undefined';
        if (!(edgesFieldName === null || edgesFieldName === void 0 ? void 0 : edgesFieldName.endsWith('Edge'))) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-connection-types-spec-pinterest-customization', `The \`${typeName}.edges\` field type must be of a valid type, while \`${edgesFieldName}\` isn\'t.`, [connectionNode]));
            return false;
        }
        return true;
    };
    const isValidPageInfoField = (pageInfoField, connectionNode) => {
        const typeName = connectionNode.name.value;
        const printedPageInfoFieldType = pageInfoField
            ? printer.print(pageInfoField.type)
            : 'undefined';
        if (printedPageInfoFieldType != 'PageInfo!') {
            context.reportError(new validation_error.validation_error.ValidationError('relay-connection-types-spec-pinterest-customization', `The \`${typeName}.pageInfo\` field must return a non-null \`PageInfo\` object not \`${printedPageInfoFieldType}\`.`, [connectionNode]));
            return false;
        }
        return true;
    };
    return {
        ScalarTypeDefinition: ensureNameDoesNotEndWithConnection,
        InterfaceTypeDefinition: ensureNameDoesNotEndWithConnection,
        UnionTypeDefinition: ensureNameDoesNotEndWithConnection,
        EnumTypeDefinition: ensureNameDoesNotEndWithConnection,
        InputObjectTypeDefinition: ensureNameDoesNotEndWithConnection,
        ObjectTypeDefinition(node) {
            let validationResult = isValidConnection(node);
            if (!validationResult) {
                return;
            }
            const [edgesNode, pageInfoNode] = getConnectionFields(node);
            validationResult = edgesNode ? isValidEdgesField(edgesNode, node) : false;
            if (!validationResult) {
                return;
            }
            validationResult = pageInfoNode
                ? isValidPageInfoField(pageInfoNode, node)
                : false;
            if (!validationResult) {
                return;
            }
        },
    };
}

exports.RelayConnectionTypesSpecPinterestCustomization = RelayConnectionTypesSpecPinterestCustomization;
