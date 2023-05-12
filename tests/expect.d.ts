namespace jest {
    interface Expect {
        sameObject(expected: object): any;
    }
    interface InverseAsymmetricMatchers {
        sameObject(expected: object): any;
    }
    interface Matchers<R, T = {}> {
        toBeErrorWithCode(code: string, message?: string): any;
        toHaveClassName(className: string): any;
    }
}
