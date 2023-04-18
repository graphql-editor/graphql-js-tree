export const trimGraphQL = (s: string) =>
  s
    .replace(/\s\s+/g, ' ')
    .replace(/(\r\n|\n|\r)/gm, '')
    .replace(/,\s/gm, ',')
    .replace(/([{}()=:])\s/gm, '$1')
    .replace(/\s([{}()=:])/gm, '$1')
    .replace(/([{}()=:])\s/gm, '$1')
    .replace(/^\s/, '');
export const expectTrimmedEqual = (s: string, s2: string) => expect(trimGraphQL(s)).toEqual(trimGraphQL(s2));
