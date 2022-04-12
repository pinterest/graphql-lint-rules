
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

function RelayContainerReturnsConnection(context) {
    const ensureNameDoesNotEndWithContainer = (node) => {
        if (node.name.value.match(/ConnectionContainer$/)) {
            context.reportError(new validation_error.validation_error.ValidationError('relay-container-returns-connection', `Types that end in \`ConnectionContainer\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`, [node]));
        }
    };
    return {
        ScalarTypeDefinition: ensureNameDoesNotEndWithContainer,
        InterfaceTypeDefinition: ensureNameDoesNotEndWithContainer,
        UnionTypeDefinition: ensureNameDoesNotEndWithContainer,
        EnumTypeDefinition: ensureNameDoesNotEndWithContainer,
        InputObjectTypeDefinition: ensureNameDoesNotEndWithContainer,
        ObjectTypeDefinition(node) {
            var _a;
            const typeName = node.name.value;
            if (!typeName.endsWith('ConnectionContainer')) {
                return;
            }
            const returnsConnection = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.every((field) => field.type.name.value.endsWith('Connection'));
            if (!returnsConnection) {
                context.reportError(new validation_error.validation_error.ValidationError('relay-container-returns-connection', `The \`${typeName}\` Container must return a Connection.`, [node]));
                return;
            }
        },
    };
}

exports.RelayContainerReturnsConnection = RelayContainerReturnsConnection;
