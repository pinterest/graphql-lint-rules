
/** Copyright 2020-present, Pinterest, Inc.
 *
 * @generated with rollup
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./index-34b81f35.js');
require('events');
require('child_process');
require('path');
require('fs');
require('os');
require('module');

function RelayContainerReturnsConnection(context) {
    const ensureNameDoesNotEndWithContainer = (node) => {
        if (node.name.value.match(/ConnectionContainer$/)) {
            context.reportError(new index.ValidationError('relay-container-returns-connection', `Types that end in \`ConnectionContainer\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`, [node]));
        }
    };
    return {
        ScalarTypeDefinition: ensureNameDoesNotEndWithContainer,
        InterfaceTypeDefinition: ensureNameDoesNotEndWithContainer,
        UnionTypeDefinition: ensureNameDoesNotEndWithContainer,
        EnumTypeDefinition: ensureNameDoesNotEndWithContainer,
        InputObjectTypeDefinition: ensureNameDoesNotEndWithContainer,
        ObjectTypeDefinition(node) {
            const typeName = node.name.value;
            if (!typeName.endsWith('ConnectionContainer')) {
                return;
            }
            const returnsConnection = node.fields?.every((field) => field.type.name.value.endsWith('Connection'));
            if (!returnsConnection) {
                context.reportError(new index.ValidationError('relay-container-returns-connection', `The \`${typeName}\` Container must return a Connection.`, [node]));
                return;
            }
        },
    };
}

exports.RelayContainerReturnsConnection = RelayContainerReturnsConnection;
