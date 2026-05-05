import { mockFn, verifyCalls } from "@misonou/test-utils";
import { addExtension, install } from "src/app";
import brew from "src/core";
import defaults from "src/defaults";

describe('brew', () => {
    it('should initialize extensions in the correct order as early as possible', async () => {
        const cb = mockFn();
        const getInit = (name) => {
            return (app) => {
                cb(name);
                app.define({ [name + 'Inited']: true });
            };
        };

        install('legacy', getInit('legacy'));
        install('legacy2', getInit('legacy2'));
        defaults.legacy = true;

        addExtension('fake', getInit('fake'));

        const Foo = addExtension('foo', ['?fake'], getInit('foo'));
        const Bar = addExtension(true, 'bar', ['?foo'], getInit('bar'));
        const Baz = addExtension('baz', ['foo'], getInit('baz'));
        const Qux = addExtension('qux', ['fake'], getInit('qux'));
        const Rux = addExtension('rux', ['qux'], getInit('rux'));
        const Ruz = addExtension('ruz', ['?qux', 'baz'], getInit('ruz'));

        const app = brew.with(Bar, Foo, Baz, Qux, Rux, Ruz)(app => {
            expect(app.legacyInited).toBe(true);
            expect(app.legacy2Inited).toBeUndefined();
            app.useBaz();
            app.useFoo();
            expect(app.fooInited).toBe(true);
            expect(app.barInited).toBe(true);
            expect(app.bazInited).toBe(true);

            expect(() => app.useFoo()).toThrowError(/already/i);
            app.useRux();
            app.useRuz();
            app.useQux();
            expect(app.quxInited).toBeUndefined();
            expect(app.ruxInited).toBeUndefined();
            expect(app.ruzInited).toBe(true);
        });
        await expect(app.ready).rejects.toBeInstanceOf(Error);
        expect(app.quxInited).toBeUndefined();
        expect(app.ruxInited).toBeUndefined();

        verifyCalls(cb, [
            ['legacy'],
            ['foo'],
            ['bar'],
            ['baz'],
            ['ruz'],
        ]);

        expect(console.error).toHaveBeenCalledTimes(2);
        expect(console.error.mock.calls[0][0]).toMatchObject({ message: 'Extension rux requires qux' });
        expect(console.error.mock.calls[1][0]).toMatchObject({ message: 'Extension qux requires fake' });
    });
});
