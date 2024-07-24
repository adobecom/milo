import {
    CheckoutType,
    WorkflowStep,
} from '@pandora/commerce-checkout-url-builder';
import {
    ProviderEnvironment,
    Landscape,
    Environment,
} from '@pandora/data-source-utils';
import {
    PriceDetails,
    ResolvedOffer,
    Term,
    Commitment,
} from '@pandora/data-models-odm';

type RequiredKey<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
};

declare global {
    namespace Commerce {
        type AnyOptions = Partial<Record<keyof Options, any>>;

        type Defaults = Readonly<
            Omit<
                Commerce.Checkout.Settings &
                    Commerce.Price.Settings &
                    Commerce.Wcs.Settings,
                'locale' | 'priceLiteralsURL' | 'quantity'
            > & {
                quantity: number;
            }
        >;

        type createPlaceholder = <T extends PlaceholderConstructor>(
            Class: T,
            dataset?: Record<string, any>
        ) => InstanceType<T>;

        type definePlaceholder = <T extends PlaceholderConstructor>(
            Class: T
        ) => T &
            PlaceholderConstants & { new (): InstanceType<T> & Placeholder };

        type getLocaleSettings = (
            config?: Pick<Config, 'locale'>
        ) => Pick<Settings, 'country' | 'language' | 'locale'>;

        type getSettings = (
            config?: Config
        ) => Checkout.Settings & Price.Settings & Wcs.Settings;

        type initService = (
            getConfig?: () => Config,
            getProviders?: () => DataProviders
        ) => Promise<Readonly<Instance>>;

        type resetService = () => void;

        type useService = () => Instance | null;

        interface Config {
            commerce?: Partial<
                Record<
                    | keyof Checkout.Settings
                    | keyof Price.Settings
                    | keyof Wcs.Settings,
                    any
                >
            >;
            env?: {
                name: string;
            };
            locale?: {
                ietf?: string;
                prefix?: string;
            };
        }

        interface DataProviders {
            getCheckoutAction: (
                offers: ResolvedOffer[],
                options?: AnyOptions,
                imsSignedInPromise?: Commerce.Ims.imsSignedInResponse,
            ) => Promise<Commerce.Checkout.CheckoutAction>;
            force: boolean;
        }

        interface Instance
            extends Checkout.Client,
                Ims.Client,
                Price.Client,
                Wcs.Client,
                PlaceholderConstants,
                HTMLElement {
            readonly ERROR_MESSAGE_BAD_REQUEST: string;
            readonly ERROR_MESSAGE_OFFER_NOT_FOUND: string;
            readonly EVENT_TYPE_ERROR: string;
            readonly EVENT_TYPE_READY: string;
            readonly Log: Log.Root;
            readonly defaults: Defaults;
            readonly providers: {
                /**
                 * Registers checkout options provider - a function accepting
                 * checkout options object and modifying it.
                 */
                placeholder(
                    provider: Checkout.provideCheckoutOptions
                ): () => void;
                /**
                 * Registers price options provider - a function accepting
                 * price options object and modifying it.
                 */
                price(provider: Price.providePriceOptions): () => void;
            };
            readonly literals: Literals;
            readonly settings: Readonly<
                Checkout.Settings & Price.Settings & Wcs.Settings
            >;
        }

        interface Literals {
            price: Price.Literals;
        }

        interface Options extends Settings {
            perpetual: boolean;
            wcsOsi: string[];
        }

        interface Settings {
            country: string;
            env: ProviderEnvironment;
            landscape: Landscape;
            // TODO: ideally, this setting should be processed by price template and belong to price settings
            forceTaxExclusive: boolean;
            language: string;
            locale: string;
            promotionCode: string;
            quantity: number[];
        }

        interface Placeholder extends HTMLElement {
            readonly constructor: PlaceholderConstructor;
            readonly error?: Error;
            readonly isCheckoutLink: boolean;
            readonly isInlinePrice: boolean;
            readonly log: Commerce.Log.Instance;
            readonly options?: Options;
            readonly state: string;
            readonly value?: Wcs.Offer[];
            attributeChangedCallback(
                name: string,
                oldValue: any,
                newValue: any
            ): void;
            connectedCallback(): void;
            disconnectedCallback(): void;
            onceSettled(): Promise<Placeholder>;
            render(overrides?: Record<string, any>): Promise<boolean>;
            toggleFailed(
                version: number,
                error: Error,
                options?: Options
            ): boolean;
            togglePending(options?: Options): number;
            toggleResolved(
                version: number,
                value: Wcs.Offer[],
                options?: Options
            ): boolean;
            requestUpdate(force?: boolean): void;
        }

        interface PlaceholderConstants extends PlaceholderConstructor {
            readonly CLASS_NAME_FAILED: string;
            readonly CLASS_NAME_PENDING: string;
            readonly CLASS_NAME_RESOLVED: string;
            readonly EVENT_TYPE_FAILED: string;
            readonly EVENT_TYPE_PENDING: string;
            readonly EVENT_TYPE_RESOLVED: string;
            readonly STATE_FAILED: string;
            readonly STATE_PENDING: string;
            readonly STATE_RESOLVED: string;
        }

        interface PlaceholderConstructor extends CustomElementConstructor {
            readonly is: string;
            readonly tag: string;
        }

        module Checkout {
            type AnyOptions = Partial<Record<keyof Options, any>>;

            type CheckoutWorkflow = {
                [Key in keyof typeof CheckoutType]: typeof CheckoutType[Key];
            };

            type CheckoutWorkflowStep = {
                [Key in keyof typeof WorkflowStep]: typeof WorkflowStep[Key];
            };

            interface CheckoutAction {
                handler?: (this: Options) => void;
                type?: 'download' | 'open' | 'upgrade';
                text?: string;
                className?: string;
                url: string;
            }

            type buildCheckoutAction = (
                offers: ResolvedOffer[],
                options?: AnyOptions
            ) => Promise<CheckoutAction>;

            type buildCheckoutURL = (
                offers: ResolvedOffer[],
                options?: AnyOptions
            ) => string;

            type collectCheckoutOptions = (
                options?: AnyOptions,
                placeholder?: Placeholder
            ) => Options;

            type provideCheckoutOptions = (
                element: Placeholder,
                options: Options
            ) => void;

            interface Client {
                CheckoutLink: PlaceholderConstructor & PlaceholderConstants;
                CheckoutWorkflow: CheckoutWorkflow;
                CheckoutWorkflowStep: CheckoutWorkflowStep;
                /**
                 * Returns checkout url string for given product offers and checkout options.
                 */
                buildCheckoutAction: buildCheckoutAction;
                buildCheckoutURL: buildCheckoutURL;
                collectCheckoutOptions: collectCheckoutOptions;
                createCheckoutLink: PlaceholderConstructor['createCheckoutLink'];
                getCheckoutLinks: PlaceholderConstructor['getCheckoutLinks'];
            }

            interface Options extends Commerce.Options, Settings {
                checkoutMarketSegment?: string;
                checkoutPromoCode: string;
            }

            interface Placeholder
                extends HTMLAnchorElement,
                    Omit<
                        Commerce.Placeholder,
                        'addEventListener' | 'removeEventListener'
                    > {
                readonly isCheckoutLink: true;
                readonly options?: Options;
                new?(): Placeholder;
                /**
                 * Returns a promise resolving to this placeholder
                 * when its value is resolved or rejected.
                 * If placeholder is not pending for completion of an async operation
                 * the returned promise is already resolved or rejected.
                 */
                onceSettled(): Promise<Placeholder>;
                renderOffers(
                    offers: Wcs.Offer[],
                    overrides?: AnyOptions,
                    version?: number
                ): void;
                /**
                 * Updates given options of this placeholder
                 * and re-resolves it if necessary.
                 */
                updateOptions(options?: AnyOptions): void;
            }

            interface PlaceholderClass
                extends Commerce.PlaceholderConstructor,
                    PlaceholderConstructor {}

            interface PlaceholderConstructor
                extends Commerce.PlaceholderConstructor {
                /**
                 * Creates and returns new checkout link placeholder element.
                 */
                createCheckoutLink(
                    options?: AnyOptions,
                    innerHTML?: string
                ): Placeholder | null;
                getCheckoutLinks(container?: Element): Placeholder[];
            }

            type CheckoutLinkParameter =
            'ai' |
            'appctxid' |
            'context.guid' |
            'csm' |
            'ctxRtUrl' |
            'DCWATC' |
            'dp' |
            'fr' |
            'gsp' |
            'jit' |
            'lo' |
            'mal' |
            'mv' |
            'mv2' |
            'nglwfdata' |
            'otac' |
            'pcid' |
            'promoid' |
            'rf' |
            'rUrl' |
            'sc' |
            'scl' |
            'sdid' |
            'sid' |
            'so.ca' |
            'so.su' |
            'so.tr' |
            'so.va' |
            'svar' |
            'th' |
            'thm' |
            'trackingid' |
            'usid' |
            'workflowid' |
            'af';

            interface Settings extends Commerce.Settings {
                checkoutClientId: string;
                checkoutWorkflow: CheckoutType;
                checkoutWorkflowStep: WorkflowStep;
                entitlement: boolean;
                upgrade: boolean;
                modal: boolean;
                extraOptions: Partial<Record<keyof CheckoutLinkParameter, any>>;
            }
        }

        module Ims {
            type imsReadyResponse = Promise<void>;
            type imsSignedInResponse = Promise<boolean>;
            type imsReady = (options?: {
                interval?: number;
                maxAttempts?: number;
            }) => imsReadyResponse;
            type imsSignedIn = (
                imsReady: imsReadyResponse
            ) => imsSignedInResponse;
            type imsCountry = (
                imsSignedIn: imsSignedInResponse
            ) => Promise<string>;

            interface Client {
                /**
                 * A promise resolving when IMS is ready.
                 */
                imsReadyPromise: Promise<void>;
                /**
                 * A promise resolving with boolean value indicating whether user is signed in.
                 */
                imsSignedInPromise: Promise<boolean>;
                /**
                 * A promise resolving with country code configured for current user in IMS.
                 */
                imsCountryPromise: Promise<string | void>;
            }
        }

        module Log {
            type Appender = RequiredKey<Plugin, 'append'>;
            type Filter = RequiredKey<Plugin, 'filter'>;
            type Level = 'debug' | 'error' | 'info' | 'warn';

            interface Entry {
                level: Level;
                message: string;
                namespace: string;
                params: any[];
                source: string;
                timestamp: number;
            }

            interface Instance {
                readonly id: string;
                readonly namespace: string;
                debug: Logger;
                error: Logger;
                /**
                 * Creates and returns new instance of `Log`
                 * bound to source module specified by `name`.
                 *
                 * New log instance will append `name` to namespace of its records.
                 */
                module(name: string): Instance;
                info: Logger;
                warn: Logger;
            }

            interface Logger {
                (message: string, ...params: any[]): void;
                (message: string, params: () => any[]): void;
            }

            interface Plugin {
                append?(record: Entry): void;
                filter?(record: Entry): boolean;
            }

            interface Root extends Instance {
                Level: Record<Uppercase<Level>, Level>;
                Plugins: {
                    /**
                     * Writes log records to devtools console.
                     * Used by default in `local` env.
                     */
                    consoleAppender: Plugin;
                    /**
                     * Filters out all debug records.
                     * Used by default in `prod` env.
                     */
                    debugFilter: Plugin;
                    /**
                     * Filters out all records.
                     * Useful in tests.
                     */
                    quietFilter: Plugin;
                    /**
                     * Sends log error records to Lana.
                     * Used by default in `prod` env.
                     */
                    lanaAppender: Plugin;
                };
                /**
                 * Registers built-in log plugins suitable for provided `env`.
                 * @param env Milo `config.env` object.
                 */
                init(env?: { name: string }): Log.Root;
                /**
                 * Resets all log plugins registrations.
                 */
                reset(): void;
                /**
                 * Registers given log plugins.
                 */
                use(...plugins: Plugin[]): void;
            }
        }

        module Price {
            type AnyOptions = Partial<Record<keyof Options, any>>;

            type Literals = Record<string, string>;

            type buildPriceHTML = (
                offers: ResolvedOffer[],
                options?: AnyOptions
            ) => string;

            type collectPriceOptions = (
                overrides: AnyOptions,
                placeholder?: Placeholder
            ) => Options;

            type providePriceOptions = (
                element: Placeholder,
                options: Options
            ) => void;

            interface Client {
                InlinePrice: PlaceholderConstructor & PlaceholderConstants;
                buildPriceHTML: buildPriceHTML;
                collectPriceOptions: collectPriceOptions;
                createInlinePrice: PlaceholderConstructor['createInlinePrice'];
                getInlinePrices: PlaceholderConstructor['getInlinePrices'];
            }

            interface Options extends Commerce.Options, Settings {
                displayOldPrice: boolean;
                literals: Literals;
                template: string;
            }

            interface Placeholder
                extends HTMLSpanElement,
                    Commerce.Placeholder {
                readonly isInlinePrice: true;
                readonly options?: Options;
                /**
                 * Returns a promise resolving to this placeholder
                 * when its value is resolved or rejected.
                 * If placeholder is not pending for completion of an async operation
                 * the returned promise is already resolved or rejected.
                 */
                onceSettled(): Promise<Placeholder>;
                renderOffers(
                    offers: Wcs.Offer[],
                    overrides?: Partial<Options>,
                    version?: number
                ): void;
                updateOptions(options?: AnyOptions): void;
            }

            interface PlaceholderConstructor
                extends Commerce.PlaceholderConstructor {
                createInlinePrice(options?: AnyOptions): Placeholder | null;
                /**
                 * Selects and returns all inline price placeholders located in the given `container`.
                 * Uses `document.body` if `conainer` is omitted.
                 */
                getInlinePrices(container?: Element): Placeholder[];
            }

            interface Settings extends Commerce.Settings {
                displayOldPrice: boolean;
                displayPerUnit: boolean;
                displayRecurrence: boolean;
                displayTax: boolean;
                forceTaxExclusive: boolean;
                priceLiteralsURL: string;
                priceLiteralsPromise: Promise<Response>;
            }
        }

        module Wcs {
            type PlanType = 'ABM' | 'PUF' | 'M2M' | 'PERPETUAL' | 'P3Y';
            type WcsCommitment = Record<Commitment, Commitment>;
            type WcsPlanType = Record<PlanType, PlanType>;
            type WcsTerm = Record<Term, Term>;

            interface Client {
                WcsCommitment: Record<Commitment, Commitment>;
                WcsPlanType: Record<PlanType, PlanType>;
                WcsTerm: Record<Term, Term>;

                /**
                 * Resolves requested list of "Offer Selector Ids" (`osis`) from Wcs or local cache.
                 * Returns one promise per osi, the promise resolves to array of product offers
                 * associated with this osi.
                 *
                 * If `multiple` is set to false (this is default value), resolved array will contain only one
                 * offer, selected by country/language-perpetual algorithm.
                 * Otherwise. all responded offers are returned.
                 *
                 * If `forceTaxExclusive` is set to true (default value defined in settings),
                 * then returned prices are transformed into tax exclusive variant.
                 */
                resolveOfferSelectors(
                    options: Partial<
                        Pick<
                            Commerce.Options,
                            | 'country'
                            | 'language'
                            | 'perpetual'
                            | 'promotionCode'
                            | 'wcsOsi'
                        >
                    >
                ): Promise<Offer[]>[];
            }

            interface Offer extends ResolvedOffer {
                planType: PlanType;
                priceDetails: PriceDetails & {
                    priceWithoutDiscount?: number;
                    priceWithoutDiscountAndTax?: number;
                    priceWithoutTax?: number;
                };
            }

            interface Settings extends Commerce.Settings {
                wcsApiKey: string;
                wcsBufferDelay: number;
                wcsBufferLimit: number;
                wcsEnv: Environment;
                domainSwitch: boolean;
            }
        }
    }

    interface Window {
        adobeIMS: {
            initialized: boolean;
            getProfile(): Promise<{ countryCode: string }>;
            isSignedInUser(): boolean;
        };
        lana: {
            log: (msg: string, options: {}) => void;
        };
    }
}

export declare const TAG_NAME_SERVICE: string;
export declare const CheckoutLink: Commerce.Checkout.PlaceholderConstructor;
export declare const CheckoutWorkflow: Commerce.Checkout.CheckoutWorkflow;
export declare const CheckoutWorkflowStep: Commerce.Checkout.CheckoutWorkflowStep;
export declare const Defaults: Commerce.Defaults;
export declare const InlinePrice: Commerce.Price.PlaceholderConstructor;
export declare const Log: Commerce.Log.Root;
export declare const WcsCommitment: Commerce.Wcs.WcsCommitment;
export declare const WcsPlanType: Commerce.Wcs.WcsPlanType;
export declare const WcsTerm: Commerce.Wcs.WcsTerm;
export declare const getLocaleSettings: Commerce.getLocaleSettings;
export declare const getSettings: Commerce.getSettings;
/**
 * Returns promise resolving to active instance of `Commerce` service.
 * When called for first time with `getConfig` function provided
 * or if `force` argument is set to `true`, initialises `Commerce` service:
 * - configures `Wcs Client` and `Checkout Url Builder`,
 * - downloads commerce literals needed for configured locale,
 * - activates web components for `merch` auto-blocks: `checkout link` and `inline price`.
 * @example
 * init();
 * init(getConfig);
 * init(getConfig, true);
 */
export declare const init: Commerce.initService;
/**
 * Disposes active instance of `Commerce` service allowing it to be initialised again
 * via normal call to `init`.
 */
export declare const reset: Commerce.resetService;
