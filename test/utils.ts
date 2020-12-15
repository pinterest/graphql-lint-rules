export const gql = (literals: TemplateStringsArray): string => {
  return literals.join('');
};