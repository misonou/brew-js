namespace jest {
    interface Matchers<R, T = {}> {
        toBeErrorWithCode(code: string, message?: string): any;
        toHaveClassName(className: string): any;
    }
}
