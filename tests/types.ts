/// <reference path="../src/types.d.ts" />

import { expectTypeOf } from "expect-type";

declare const _: unknown;
declare const app: Brew.AppInstance<{}>;

type Ext1 = Brew.EventDispatcher<'e1', { e1: Zeta.ZetaEventBase }>;
type Ext2 = Brew.EventDispatcher<'e2', { e2: Zeta.ZetaEventBase }>;
type ExtractEventMap<T> = T extends Zeta.ZetaEventDispatcher<infer M, any> ? M : unknown;

expectTypeOf<ExtractEventMap<Brew.AppInstance<Ext1 & Ext2>>>().toMatchTypeOf<{
    e1: Zeta.ZetaEventBase;
    e2: Zeta.ZetaEventBase;
}>();

app.on('statechange', (_1: Brew.StateChangeEvent) => _);
app.on('div', 'statechange', (_1: Brew.StateChangeEvent) => _);
app.on(<HTMLDivElement>_, 'statechange', (_1: Brew.StateChangeEvent) => _);

app.on('statechange', (e, self) => {
    expectTypeOf(self).toEqualTypeOf<Brew.AppInstance<{}>>();
    expectTypeOf(e.context).toEqualTypeOf<Brew.AppInstance<{}>>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<Brew.AppInstance<{}>>();
});
app.on('div', 'statechange', (e, self) => {
    expectTypeOf(self).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(e.context).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLDivElement>();
});
app.on(<HTMLDivElement>_, 'statechange', (e, self) => {
    expectTypeOf(self).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(e.context).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLDivElement>();
});

app.on({
    statechange(_1: Brew.StateChangeEvent) { }
});
app.on('div', {
    statechange(_1: Brew.StateChangeEvent) { }
});
app.on(<HTMLDivElement>_, {
    statechange(_1: Brew.StateChangeEvent) { }
});

app.on({
    statechange(...args) {
        expectTypeOf(args).toEqualTypeOf<[Brew.StateChangeEvent & Zeta.ZetaEventContext<Brew.AppInstance<{}>>, Brew.AppInstance<{}>]>();
    }
});
app.on('div', {
    statechange(...args) {
        expectTypeOf(args).toEqualTypeOf<[Brew.StateChangeEvent & Zeta.ZetaEventContext<HTMLDivElement>, HTMLDivElement]>();
    }
});
app.on(<HTMLDivElement>_, {
    statechange(...args) {
        expectTypeOf(args).toEqualTypeOf<[Brew.StateChangeEvent & Zeta.ZetaEventContext<HTMLDivElement>, HTMLDivElement]>();
    }
});
