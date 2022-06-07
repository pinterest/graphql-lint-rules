
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

function isProperEntityIdField(field) {
    return (field.name.value == 'entityId' &&
        utils.isNonNullTypeNode(field.type) &&
        utils.isNamedTypeNode(field.type.type) &&
        field.type.type.name.value == 'String');
}
function NodesContainEntityId(context) {
    return {
        ObjectTypeDefinition(node) {
            if (node.interfaces?.some((iface) => iface.name.value == 'Node') &&
                !node.fields?.some((field) => isProperEntityIdField(field))) {
                context.reportError(new index.ValidationError('nodes-contain-entity-id', `The Node type \`${node.name.value}\` must have a non-nullable "entityId" string.`, [node]));
            }
        },
    };
}

exports.NodesContainEntityId = NodesContainEntityId;
