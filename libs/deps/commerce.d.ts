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

        type ClassName = {
            FAILED: string;
            PENDING: string;
            RESOLVED: string;
        };

        type Defaults = Readonly<
            Omit<
                Commerce.Checkout.Settings &
                    Commerce.Price.Settings &
                    Commerce.Wcs.Settings,
                'locale' | 'priceLiteralsURL'
            >
        >;

        type ErrorMessage = {
            BAD_REQUEST: string;
            OFFER_NOT_FOUND: string;
        };

        type getLocaleSettings = (
            config?: Pick<Config, 'locale'>
        ) => Pick<Settings, 'country' | 'language' | 'locale'>;

        type getPromotionCode = (options?: AnyOptions) => string;

        type getSettings = (
            config?: Config
        ) => Checkout.Settings & Price.Settings & Wcs.Settings;

        type init = (
            callback?: () => Config,
            force?: boolean
        ) => Promise<Readonly<Instance>>;

        type makeHTMLPlaceholder = <T extends CustomElementConstructor>(
            extendsTag: string,
            customTag: string,
            Class: T
        ) => T;

        type reset = () => void;

        interface Config {
            commerce?: Partial<
                Record<keyof Checkout.Settings | keyof Price.Settings | keyof Wcs.Settings, any>
            >;
            env?: {
                name: string;
            };
            locale?: {
                ietf?: string;
                prefix?: string;
            };
        }

        interface Instance
            extends Checkout.Client,
                Ims.Client,
                Price.Client,
                Wcs.Client {
            readonly ClassName: ClassName;
            readonly ErrorMessage: ErrorMessage;
            readonly log: Log.Instance;
            readonly providers: {
                /**
                 * Registers price options provider - a function accepting
                 * price options object and modifying it as needed in specific context.
                 */
                price(provider: Price.provideOptions): () => void;
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
            wcsOsi: string | string[];
        }

        interface Settings {
            country: string;
            env: ProviderEnvironment;
            // TODO: ideally, this setting should be processed by price template and belong to price settings
            forceTaxExclusive: boolean;
            language: string;
            locale: string;
            promotionCode: string;
            quantity: number | number[];
        }

        interface HTMLPlaceholderMixin {
            init(): void;
            onceSettled(): Promise<HTMLPlaceholderMixin>;
            render(overrides?: Record<string, any>): Promise<boolean>;
            toggleFailed(version: number, error?: Error): boolean;
            togglePending(): number;
            toggleResolved(version: number): boolean;
        }

        module Checkout {
            type AnyOptions = Partial<Record<keyof Options, any>>;

            type buildCheckoutURL = (
                offers: ResolvedOffer[],
                options: AnyOptions
            ) => string;

            type collectCheckoutOptions = (options?: AnyOptions) => Options;

            type createCheckoutLink = (
                options?: AnyOptions,
                innerHTML?: string
            ) => HTMLCustomAnchorElement;

            interface Client {
                CheckoutWorkflow: {
                    [Key in keyof typeof CheckoutType]: typeof CheckoutType[Key];
                };
                CheckoutWorkflowStep: {
                    [Key in keyof typeof WorkflowStep]: typeof WorkflowStep[Key];
                };

                /**
                 * Returns checkout url string for given product offers and checkout options.
                 */
                buildCheckoutURL: buildCheckoutURL;
                collectCheckoutOptions: collectCheckoutOptions;
                createCheckoutLink: createCheckoutLink;
            }

            interface HTMLCustomAnchorElement
                extends HTMLAnchorElement,
                    HTMLPlaceholderMixin {
                renderOffers(
                    offers: Wcs.Offer[],
                    overrides?: AnyOptions,
                    version?: number
                ): void;
            }

            interface Options extends Commerce.Options, Settings {
                checkoutMarketSegment?: string;
                checkoutPromoCode: string;
            }

            interface Settings extends Commerce.Settings {
                checkoutClientId: string;
                checkoutWorkflow: CheckoutType;
                checkoutWorkflowStep: WorkflowStep;
            }
        }

        module Ims {
            type pollImsCountry = (options?: {
                interval?: number;
                maxAttempts?: number;
            }) => Promise<string | void>;

            interface Client {
                /**
                 * A promise resolving with country code configured for current user in IMS.
                 */
                imsCountry: Promise<string | void>;
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
                debug(message: string, ...params: any[]): void;
                error(message: string, ...params: any[]): void;
                /**
                 * Creates and returns new instance of `Log`
                 * bound to source module specified by `name`.
                 *
                 * New log instance will append `name` to namespace of its records.
                 */
                module(name: string): Instance;
                info(message: string, ...params: any[]): void;
                warn(message: string, ...params: any[]): void;
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
                init(env?: { name: string }): void;
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
                options: Options
            ) => string;

            type collectPriceOptions = (options: AnyOptions) => Options;

            type createInlinePrice = (
                options: Partial<Record<keyof Options, any>>
            ) => HTMLCustomSpanElement;

            type provideOptions = (
                element: HTMLCustomSpanElement,
                options: Record<string, any>
            ) => void;

            interface Client {
                buildPriceHTML: buildPriceHTML;
                createInlinePrice: createInlinePrice;
                collectPriceOptions: collectPriceOptions;
            }

            interface HTMLCustomSpanElement
                extends HTMLSpanElement,
                    HTMLPlaceholderMixin {
                new (): HTMLCustomSpanElement;
                renderOffers(
                    offers: Wcs.Offer[],
                    overrides?: Partial<Options>,
                    version?: number
                ): void;
            }

            interface Options extends Commerce.Options, Settings {
                displayOldPrice: boolean;
                literals: Literals;
                template: string;
            }

            interface Settings extends Commerce.Settings {
                displayPerUnit: boolean;
                displayRecurrence: boolean;
                displayTax: boolean;
                forceTaxExclusive: boolean;
                priceLiteralsURL?: URL;
            }
        }

        module Wcs {
            type PlanType = 'ABM' | 'PUF' | 'M2M' | 'PERPETUAL';

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
                resolveOfferSelectors(options: {
                    multiple?: boolean;
                    offerSelectorIds: string[];
                    perpetual?: boolean;
                    promotionCode?: string;
                    forceTaxExclusive?: boolean;
                }): Promise<Offer[]>[];
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
                wcsLandscape: Landscape;
            }
        }
    }

    interface Window {
        adobeIMS: {
            getProfile(): Promise<{ countryCode: string }>;
            isSignedInUser(): boolean;
        };
        lana: {
            log: (msg: string, options: {}) => void;
        };
    }
}

export declare const ClassName: Commerce.ClassName;
/**
 * Default values for commerce module settings.
 */
export declare const Defaults: Commerce.Defaults;
export declare const ErrorMessage: Commerce.ErrorMessage;
export declare const Log: Commerce.Log.Root;

export declare const HTMLCheckoutAnchorElement: Commerce.Checkout.HTMLCustomAnchorElement;
export declare const HTMLPriceSpanElement: Commerce.Price.HTMLCustomSpanElement;

export declare const createCheckoutLink: Commerce.Checkout.createCheckoutLink;
export declare const createInlinePrice: Commerce.Price.createInlinePrice;
/**
 * Returns Checkout/Wcs-compatible locale info
 * mapped out of Milo config.
 */
export declare const getLocaleSettings: Commerce.getLocaleSettings;
/**
 * Collects `Commerce` module settings from:
 * - provided Milo config,
 * - page metadata,
 * - `location.search` params,
 * - storage (local/session).
 */
export declare const getSettings: Commerce.getSettings;
/**
 * Initialises `Commerce` module:
 * - configures `Wcs Client` and `Checkout Url Builder`,
 * - downloads commerce literals needed for requested locale,
 * - activates web components for `merch` auto-blocks:
 * `checkout link` and `inline price`.
 *
 * Requires `callback` function providing Milo config (e.g. `getConfig`).
 * Call this function only once and then returns shared instance
 * of Commerce module to subsequent calls to `init`,
 * unless `force` argument is set to `true`.
 */
export declare const init: Commerce.init;
export declare const makeHTMLPlaceholder: Commerce.makeHTMLPlaceholder;
/**
 * Disposes shared instance of `commerce` module and enables subsequent re-`init`.
 *
 * Useful in tests.
 */
export declare const reset: Commerce.reset;
