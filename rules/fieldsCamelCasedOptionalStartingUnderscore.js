
/** Copyright 2020-present, Pinterest, Inc.
 *
 * @generated with rollup
 *
 * This source code is licensed under the Apache License, Version 2.0
 * found in the LICENSE file in the root directory of this source tree.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('./utils-6bfcbfbc.js');

const validGraphQLNameTest = RegExp('^[_a-z][a-zA-Z0-9]*$');
function FieldsCamelCasedOptionalStartingUnderscore(context) {
    return {
        FieldDefinition: (node, _key, _parent, _path, ancestors) => {
            const fieldName = node.name.value;
            if (!validGraphQLNameTest.test(fieldName)) {
                const lastAncestor = ancestors[ancestors.length - 1];
                const parentNode = lastAncestor ? utils.unwrapAstNode(lastAncestor) : null;
                const parentName = parentNode ? utils.getNodeName(parentNode) : 'root';
                context.reportError(new utils.validation_error.ValidationError('fields-camel-cased-optional-starting-underscore', `The field \`${parentName}.${fieldName}\` is not camel-cased or starts with underscore.`, [node]));
            }
        },
    };
}

exports.FieldsCamelCasedOptionalStartingUnderscore = FieldsCamelCasedOptionalStartingUnderscore;
