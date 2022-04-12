import {
  ASTVisitor,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  TypeDefinitionNode,
  ValidationContext,
} from 'graphql';

import { getNodeName, unwrapType, ValidationError } from '../utils';
import { print } from 'graphql/language/printer';

const MANDATORY_FIELDS = ['pageInfo', 'edges'];

export function RelayConnectionTypesSpecPinterestCustomization(
  context: ValidationContext,
): ASTVisitor {
  const ensureNameDoesNotEndWithConnection = (node: TypeDefinitionNode) => {
    if (node.name.value.match(/Connection$/)) {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec-pinterest-customization',
          `Types that end in \`Connection\` must be an object type as per the relay spec. \`${node.name.value}\` is not an object type.`,
          [node],
        ),
      );
    }
  };

  const isValidConnection = (node: ObjectTypeDefinitionNode): boolean => {
    const typeName = node.name.value;
    if (!typeName.endsWith('Connection')) {
      return false;
    }
    const fieldNames = node.fields?.map((field) => field.name.value);
    const missingFields = MANDATORY_FIELDS.filter(
      (requiredField) => fieldNames?.indexOf(requiredField) === -1,
    );

    if (missingFields.length) {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec-pinterest-customization',
          `Connection \`${typeName}\` is missing the following field${
            missingFields.length > 1 ? 's' : ''
          }: ${missingFields.join(', ')}.`,
          [node],
        ),
      );
      return false;
    }
    return true;
  };

  const getConnectionFields = (
    node: ObjectTypeDefinitionNode,
  ): Array<FieldDefinitionNode | undefined> => {
    const edgesField = node.fields
      ? node.fields.find((field) => field.name.value == 'edges')
      : undefined;
    const pageInfoField = node.fields
      ? node.fields.find((field) => field.name.value == 'pageInfo')
      : undefined;

    return [edgesField, pageInfoField];
  };

  const isValidEdgesField = (
    edgesField: FieldDefinitionNode,
    connectionNode: ObjectTypeDefinitionNode,
  ): boolean => {
    const typeName = connectionNode.name.value;
    // Validates that the edges field type is of a valid type
    let edgesFieldType = edgesField?.type;

    if (edgesFieldType?.kind == 'NonNullType') {
      edgesFieldType = edgesFieldType.type;
    }

    if (edgesFieldType?.kind != 'ListType') {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec-pinterest-customization',
          `The \`${typeName}.edges\` field must return a list of edges not \`${edgesFieldType?.kind}\`.`,
          [connectionNode],
        ),
      );
      return false;
    }

    const edgesFieldName = edgesFieldType
      ? getNodeName(unwrapType(edgesFieldType))
      : 'undefined';

    if (!edgesFieldName?.endsWith('Edge')) {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec-pinterest-customization',
          `The \`${typeName}.edges\` field type must be of a valid type, while \`${edgesFieldName}\` isn\'t.`,
          [connectionNode],
        ),
      );
      return false;
    }
    return true;
  };

  const isValidPageInfoField = (
    pageInfoField: FieldDefinitionNode,
    connectionNode: ObjectTypeDefinitionNode,
  ): boolean => {
    const typeName = connectionNode.name.value;
    // Validates that the pageInfo field type is of a valid type
    const printedPageInfoFieldType = pageInfoField
      ? print(pageInfoField.type)
      : 'undefined';

    if (printedPageInfoFieldType != 'PageInfo!') {
      context.reportError(
        new ValidationError(
          'relay-connection-types-spec-pinterest-customization',
          `The \`${typeName}.pageInfo\` field must return a non-null \`PageInfo\` object not \`${printedPageInfoFieldType}\`.`,
          [connectionNode],
        ),
      );
      return false;
    }
    return true;
  };

  return {
    ScalarTypeDefinition: ensureNameDoesNotEndWithConnection,
    InterfaceTypeDefinition: ensureNameDoesNotEndWithConnection,
    UnionTypeDefinition: ensureNameDoesNotEndWithConnection,
    EnumTypeDefinition: ensureNameDoesNotEndWithConnection,
    InputObjectTypeDefinition: ensureNameDoesNotEndWithConnection,
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      let validationResult = isValidConnection(node);
      if (!validationResult) {
        return;
      }

      const [edgesNode, pageInfoNode] = getConnectionFields(node);

      validationResult = edgesNode ? isValidEdgesField(edgesNode, node) : false;
      if (!validationResult) {
        return;
      }

      validationResult = pageInfoNode
        ? isValidPageInfoField(pageInfoNode, node)
        : false;
      if (!validationResult) {
        return;
      }
    },
  };
}
