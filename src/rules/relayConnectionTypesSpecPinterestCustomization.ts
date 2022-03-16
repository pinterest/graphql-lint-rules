import {
  ASTVisitor,
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

  return {
    ScalarTypeDefinition: ensureNameDoesNotEndWithConnection,
    InterfaceTypeDefinition: ensureNameDoesNotEndWithConnection,
    UnionTypeDefinition: ensureNameDoesNotEndWithConnection,
    EnumTypeDefinition: ensureNameDoesNotEndWithConnection,
    InputObjectTypeDefinition: ensureNameDoesNotEndWithConnection,
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
      const typeName = node.name.value;
      if (!typeName.endsWith('Connection')) {
        return;
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
        return;
      }

      // Validates that the edges field type is of a valid type
      const edgesField = node.fields?.find(
        (field) => field.name.value == 'edges',
      );
      let edgesFieldType = edgesField?.type;

      if (edgesFieldType?.kind == 'NonNullType') {
        edgesFieldType = edgesFieldType.type;
      }

      const edgesFieldName = edgesFieldType
        ? getNodeName(unwrapType(edgesFieldType))
        : 'undefined';

      if (edgesFieldType?.kind != 'ListType') {
        context.reportError(
          new ValidationError(
            'relay-connection-types-spec-pinterest-customization',
            `The \`${typeName}.edges\` field must return a list of edges not \`${edgesFieldType?.kind}\`.`,
            [node],
          ),
        );
        return;
      }

      if (!edgesField || !edgesFieldName?.endsWith('Edge')) {
        context.reportError(
          new ValidationError(
            'relay-connection-types-spec-pinterest-customization',
            `The \`${typeName}.edges\` field type must be of a valid type, while \`${edgesFieldName}\` isn\'t.`,
            [node],
          ),
        );
        return;
      }

      // Validates that the pageInfo field type is of a valid type
      const pageInfoField = node.fields?.find(
        (field) => field.name.value == 'pageInfo',
      );
      const printedPageInfoFieldType = pageInfoField
        ? print(pageInfoField.type)
        : 'undefined';

      if (printedPageInfoFieldType != 'PageInfo!') {
        context.reportError(
          new ValidationError(
            'relay-connection-types-spec-pinterest-customization',
            `The \`${typeName}.pageInfo\` field must return a non-null \`PageInfo\` object not \`${printedPageInfoFieldType}\`.`,
            [node],
          ),
        );
        return;
      }
    },
  };
}
