// for testing getVar
document.documentElement.setAttribute('var', '{ }');

jest.mock('lz-string', () => ({
    compressToUTF16: v => v,
    decompressFromUTF16: v => v
}));
