import { EntityMetadata } from 'typeorm';

export const nullifyEntity = <T>(entity: T, metadata: EntityMetadata, excludedFields: string[] = []) => {
  const fieldsToNullify = metadata.columns
    .map(column => column.propertyName)
    .filter(field => !excludedFields.includes(field));

  for (const field of fieldsToNullify) {
    (entity as any)[field] = null;
  }

  return entity;
};
