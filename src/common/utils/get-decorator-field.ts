import { getMetadataArgsStorage } from 'typeorm';

export const getDecoratorFields = (entity: object, decorator: string[]): string[] => {
  const metadata = getMetadataArgsStorage();

  const relations = metadata.relations.filter(relation => {
    return relation.target === entity && decorator.includes(relation.relationType);
  });

  return relations.map(relation => relation.propertyName);
};
