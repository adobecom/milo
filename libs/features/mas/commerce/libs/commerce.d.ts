

            interface Settings extends Commerce.Settings {
                checkoutClientId: string;
                checkoutWorkflow: CheckoutType;
                checkoutWorkflowStep: WorkflowStep;
                entitlement: boolean;
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
            }

            interface Settings extends Commerce.Settings {
                displayOldPrice: boolean;
                displayPerUnit: boolean;
                displayRecurrence: boolean;
                displayTax: boolean;
                forceTaxExclusive: boolean;
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
                wcsURL: string;
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
export declare const init: Commerce.init;
/**
 * Disposes active instance of `Commerce` service allowing it to be initialised again
 * via normal call to `init`.
 */
export declare const reset: Commerce.reset;
