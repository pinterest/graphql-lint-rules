
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
var utils = require('./utils-147ff1ff.js');

function isProperEntityIdField(field) {
    return (field.name.value == 'entityId' &&
        utils.isNonNullTypeNode(field.type) &&
        utils.isNamedTypeNode(field.type.type) &&
        field.type.type.name.value == 'String');
}
function NodesContainEntityId(context) {
    return {
        ObjectTypeDefinition(node) {
            var _a, _b;
            if (((_a = node.interfaces) === null || _a === void 0 ? void 0 : _a.some((iface) => iface.name.value == 'Node')) &&
                !((_b = node.fields) === null || _b === void 0 ? void 0 : _b.some((field) => isProperEntityIdField(field)))) {
                context.reportError(new validation_error.validation_error.ValidationError('nodes-contain-entity-id', `The Node type \`${node.name.value}\` must have a non-nullable "entityId" string.`, [node]));
            }
        },
    };
}

exports.NodesContainEntityId = NodesContainEntityId;
