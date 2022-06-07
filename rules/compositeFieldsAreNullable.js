
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

function isAllowedNonNullCompositeField(node, type, exceptions) {
    if (exceptions.includes(type.name)) {
        return true;
    }
    return utils.isAllowedByDirective(node, 'allowNonNull');
}
function CompositeFieldsAreNullable(configuration, context) {
    return {
        FieldDefinition: (node, _key, _parent, _path, ancestors) => {
            const { type: nodeType } = node;
            const ruleKey = 'composite-fields-are-nullable';
            if (utils.isNonNullTypeNode(nodeType)) {
                const { type: nonNullType } = nodeType;
                if (utils.isNamedTypeNode(nonNullType)) {
                    const type = index.typeFromAST(context.getSchema(), nonNullType);
                    const options = configuration.getRulesOptions()[ruleKey] || {};
                    const exceptions = options.exceptions || [];
                    if (utils.isGraphQLCompositeType(type) &&
                        !isAllowedNonNullCompositeField(node, type, exceptions)) {
                        const lastAncestor = ancestors[ancestors.length - 1];
                        const parentNode = lastAncestor
                            ? utils.unwrapAstNode(lastAncestor)
                            : null;
                        const parentName = parentNode ? utils.getNodeName(parentNode) : 'root';
                        context.reportError(new index.ValidationError(ruleKey, `The field \`${parentName}.${node.name.value}\` uses a composite type and should be nullable.`, [node]));
                    }
                }
            }
        },
    };
}

exports.CompositeFieldsAreNullable = CompositeFieldsAreNullable;
