
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

function isProperRelayIdField(field) {
    return (utils.isNonNullTypeNode(field.type) &&
        utils.isNamedTypeNode(field.type.type) &&
        field.type.type.name.value == 'ID');
}
function RelayIdFieldType(context) {
    return {
        ObjectTypeDefinition(node) {
            const idField = node.fields?.find((field) => field.name.value === 'id');
            if (idField && !isProperRelayIdField(idField)) {
                context.reportError(new index.ValidationError('relay-id-field-type', `The "id" field on \`${node.name.value}\` must be a proper Relay ID field type, or renamed.`, [node]));
            }
        },
    };
}

exports.RelayIdFieldType = RelayIdFieldType;
