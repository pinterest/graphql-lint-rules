
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

function FieldsDoNotReturnJson(configuration, context) {
    return {
        FieldDefinition: (node, _key, _parent, _path, ancestors) => {
            const ruleKey = 'fields-do-not-return-json';
            const options = configuration.getRulesOptions()[ruleKey] || {};
            const customMessage = options.customMessage
                ? '\nMore explanation: ' + options.customMessage
                : '';
            const fieldName = node.name.value;
            const fieldType = node.type;
            const lastAncestor = ancestors[ancestors.length - 1];
            const parentNode = lastAncestor ? utils.unwrapAstNode(lastAncestor) : null;
            const parentName = parentNode ? utils.getNodeName(parentNode) : 'root';
            const unwrappedFieldTypeStr = fieldType
                ? utils.getNodeName(utils.unwrapType(fieldType))
                : 'undefined';
            if (unwrappedFieldTypeStr == 'JSON') {
                context.reportError(new index.ValidationError('fields-do-not-return-json', `The field \`${parentName}.${fieldName}\` is returning a JSON value.${customMessage}`, [node]));
            }
        },
    };
}

exports.FieldsDoNotReturnJson = FieldsDoNotReturnJson;
