export function generateRandomCode(length: number, type: 'n' | 'a') {
  return type === 'n' ? generateRandomCodeWithoutALPHA(length) : generateRandomCodeWithALPHA(length);
}

function generateRandomCodeWithALPHA(length: number): string {
  const arrSize = withAlphaTable.length;
  const result = [];

  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * arrSize);
    result.push(withAlphaTable[rand]);
  }
  return result.join('');
}

function generateRandomCodeWithoutALPHA(length: number): string {
  const arrSize = onlyNumberTable.length;
  const result = [];

  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * arrSize);
    result.push(onlyNumberTable[rand]);
  }
  return result.join('');
}

const onlyNumberTable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const withAlphaTable = [
  ...onlyNumberTable,
  'A',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];
