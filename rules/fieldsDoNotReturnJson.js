
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

function FieldsDoNotReturnJson(context) {
    return {
        FieldDefinition: (node, _key, _parent, _path, ancestors) => {
            const fieldName = node.name.value;
            const fieldType = node.type;
            const lastAncestor = ancestors[ancestors.length - 1];
            const parentNode = lastAncestor ? utils.unwrapAstNode(lastAncestor) : null;
            const parentName = parentNode ? utils.getNodeName(parentNode) : 'root';
            const unwrappedFieldTypeStr = fieldType
                ? utils.getNodeName(utils.unwrapType(fieldType))
                : 'undefined';
            if (unwrappedFieldTypeStr == 'JSON') {
                context.reportError(new index.ValidationError('fields-do-not-return-json', `Check the type of the \`${parentName}.${fieldName}\` in extensions and make sure that the value_type is not a Dict. You can type it using https://w.pinadmin.com/display/API/Conversion+Patterns.`, [node]));
            }
        },
    };
}

exports.FieldsDoNotReturnJson = FieldsDoNotReturnJson;
