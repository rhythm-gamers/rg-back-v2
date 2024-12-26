export function copyDtoDatasMaintainField(entity: any, dto: any) {
  Object.keys(entity).forEach(key => {
    if (key in dto) {
      entity[key] = dto[key];
    }
  });
}

export function copyDtoDatasDeleteField(entity: any, dto: any) {
  Object.keys(entity).forEach(key => {
    if (key === 'id') return;
    entity[key] = dto[key] ? dto[key] : 0;
  });
}
