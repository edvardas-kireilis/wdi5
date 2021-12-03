import Log from "sap/base/Log"
import Control from "sap/ui/core/Control"
import RecordReplay from "sap/ui/test/RecordReplay"
import { ControlSelector } from "sap/ui/test/RecordReplay"

// copypasta from
// https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file/65561287#65561287
type ModifyDeep<A extends AnyObject, B extends DeepPartialAny<A>> = {
    [K in keyof A]: B[K] extends never ? A[K] : B[K] extends AnyObject ? ModifyDeep<A[K], B[K]> : B[K]
} & (A extends AnyObject ? Omit<B, keyof A> : A)
/** Makes each property optional and turns each leaf property into any, allowing for type overrides by narrowing any. */
type DeepPartialAny<T> = {
    [P in keyof T]?: T[P] extends AnyObject ? DeepPartialAny<T[P]> : any
}
type AnyObject = Record<string, any>
// -

// more copypasta
// https://stackoverflow.com/a/55032655/15273517
type Modify<T, R> = Omit<T, keyof R> & R
// -

export type wdi5LogLevel = "silent" | "error" | "verbose"

export interface wdi5Config extends WebdriverIO.Config {
    wdi5: {
        /** wdi5-specific logging of UI5-related operations */
        logLevel?: wdi5LogLevel
        /**
         * FQDN-suffix to append to `baseUrl` of wdio config,
         * typically "index.html"
         * @example http://localhost:8080/index.html -> "index.html"
         * @example https://ui5.sap.com/anotherIndex.html -> "anotherIndex.html"
         */
        url: string
        /** path relative to the command `wdio` is run from to store screenshots */
        screenshotPath?: string
        /**
         * late-inject wdi5 <-> UI5 bridge, useful for testing in hybrid non-UI5/UI5 apps
         * TODO: link to document on how to inject late programmatically
         */
        skipInjectUI5OnStart?: boolean
    }
}

export interface wdi5Selector {
    /**
     * optional unique internal key to map and find a control
     * if not provided, wdi5 will calculate a unique key
     */
    wdio_ui5_key?: string
    /**
     * forces the to re-retrieve the control from the browser context,
     * even if it was retrieved previously
     */
    forceSelect?: boolean
    /**
     * OPA5-style selectors from RecordReplay
     */
    selector: ControlSelector
}

// yet unused
export interface wdi5Bridge extends Window {
    bridge: RecordReplay
    wdi5: {
        createMatcher: (selector: ControlSelector) => ControlSelector
        getUI5CtlForWebObj: (ui5Control: any) => any
        retrieveControlMethods: (ui5Control: any) => string[]
        isPrimitive: (value: any) => boolean
        createControlIdMap: (ui5Controls: any[]) => Map<"id", string>
        createControlId: (ui5Control: any) => { id: string }
        isInitialized: boolean
        Log: Log
        waitForUI5Options: {
            timeout: number
            interval: number
        }
    }
}