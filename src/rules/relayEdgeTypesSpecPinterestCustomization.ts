import {
  ArgumentNode,
  ASTVisitor,
  DirectiveNode,
  EnumValueNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  TypeDefinitionNode,
  ValidationContext,
} from 'graphql';

import { print } from 'graphql/language/printer';

import { getNodeName, unwrapType, ValidationError } from '../utils';

const MANDATORY_FIELDS = ['cursor', 'node'];

export function RelayEdgeTypesSpecPinterestCustomization(
  context: ValidationContext,
): ASTVisitor {
  const hasStringArgument = (argument: ArgumentNode) => {
    return (argument.value as EnumValueNode).value == 'STRING';
  };

  const hasDirectiveWithStringArgument = (directive: DirectiveNode) => {
    const result = directive.arguments?.some(hasStringArgument);
    return typeof result === 'boolean' ? result : false;
  };

  const hasStringType = (context: ValidationContext, cursorTypeStr: string) => {
    const returnsString = cursorTypeStr === 'String';
    if (!returnsString) {
      // Checks for scalars that resolve as string as well. Example:
      // scalar Cursor
      // @serializationPrimitive(
      //     type: STRING
      // )
      const schemaType = context.getSchema().getType(cursorTypeStr);
      const hasString = schemaType?.astNode?.directives?.some(
        hasDirectiveWithStringArgument,
      );
      return hasString !== undefined ? hasString : false;
    }
    return returnsString;
  };

  const hasValidNodeType = (
    context: ValidationContext,
    node: FieldDefinitionNode,
  ) => {
    const allowedTypes = [
      'UnionTypeDefinition',
      'ObjectTypeDefinition',
      'ScalarTypeDefinition',
      'EnumTypeDefinition',
      'InterfaceTypeDefinition',
    ];
    const nodeFieldType = node?.type;
    const nodeFieldName = nodeFieldType
      ? getNodeName(unwrapType(nodeFieldType))
      : 'undefined';
    if (!nodeFieldName) {
      return false;
    }
    const schemaType = context.getSchema().getType(nodeFieldName);
    const implementsNode = allowedTypes.includes(
      schemaType?.astNode ? schemaType?.astNode?.kind : 'undefined',
    );

    return implementsNode;
  };

  const ensureNameDoesNotEndWithEdge = (node: TypeDefinitionNode) => {
    if (node.name.value.match(/Edge$/)) {
      context.reportError(
        new ValidationError(
          'relay-edge-types-spec-pinterest-customization',
          `Types that end in \`Edge\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`,
          [node],
        ),
      );
    }
  };

  return {
    ScalarTypeDefinition: ensureNameDoesNotEndWithEdge,
    InterfaceTypeDefinition: ensureNameDoesNotEndWithEdge,
    UnionTypeDefinition: ensureNameDoesNotEndWithEdge,
    EnumTypeDefinition: ensureNameDoesNotEndWithEdge,
    InputObjectTypeDefinition: ensureNameDoesNotEndWithEdge,
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      // Validates suffix
      const typeName = node.name.value;
      if (!typeName.endsWith('Edge')) {
        return;
      }
      const fieldNames = node.fields?.map((field) => field.name.value);
      const missingFields = MANDATORY_FIELDS.filter(
        (requiredField) => fieldNames?.indexOf(requiredField) === -1,
      );

      // Validates existence of mandatory fields
      if (missingFields.length) {
        context.reportError(
          new ValidationError(
            'relay-edge-types-spec-pinterest-customization',
            `Edge \`${typeName}\` is missing the following field${
              missingFields.length > 1 ? 's' : ''
            }: ${missingFields.join(', ')}.`,
            [node],
          ),
        );
        return;
      }

      // Validates that the cursor field type serializes as a String
      const cursorField = node.fields?.find(
        (field) => field.name.value == 'cursor',
      );
      let cursorFieldType = cursorField?.type;

      if (cursorFieldType?.kind == 'NonNullType') {
        cursorFieldType = cursorFieldType.type;
      }

      if (cursorFieldType?.kind != 'NamedType') {
        context.reportError(
          new ValidationError(
            'relay-edge-types-spec-pinterest-customization',
            `The \`${typeName}.cursor\` field must return a type that serializes as a String not \`${cursorFieldType}\`.`,
            [node],
          ),
        );
        return;
      }

      const cursorTypeName = cursorFieldType
        ? print(cursorFieldType)
        : 'undefined';
      if (!hasStringType(context, cursorTypeName)) {
        context.reportError(
          new ValidationError(
            'relay-edge-types-spec-pinterest-customization',
            `The \`${typeName}.cursor\` field must return a type that serializes as a String not \`${cursorTypeName}\`.`,
            [node],
          ),
        );
        return;
      }

      // Validates that the node field type is of a valid type
      const nodeField = node.fields?.find(
        (field) => field.name.value == 'node',
      );
      let nodeFieldType = nodeField?.type;

      if (nodeFieldType?.kind == 'NonNullType') {
        nodeFieldType = nodeFieldType.type;
      }

      const nodeFieldName = nodeFieldType ? print(nodeFieldType) : 'undefined';

      if (nodeFieldType?.kind == 'ListType') {
        context.reportError(
          new ValidationError(
            'relay-edge-types-spec-pinterest-customization',
            `The \`${typeName}.node\` field must return a NamedType or NonNullType, not ListType.`,
            [node],
          ),
        );
        return;
      }

      if (!nodeField || !hasValidNodeType(context, nodeField)) {
        context.reportError(
          new ValidationError(
            'relay-edge-types-spec-pinterest-customization',
            `The \`${typeName}.node\` field type must be of a valid type, while \`${nodeFieldName}\` doesn\'t.`,
            [node],
          ),
        );
        return;
      }
    },
  };
}
