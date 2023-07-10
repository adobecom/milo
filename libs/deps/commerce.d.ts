import { CheckoutData, CheckoutType, WorkflowStep } from '@pandora/commerce-checkout-url-builder';
import { ProviderEnvironment, Landscape, Environment } from '@pandora/data-source-utils';
import { PriceDetails, ResolvedOffer } from '@pandora/data-models-odm';

// TODO: expose this type from @dexter/tacocat-consonant-templates package
// type PriceLiterals = import('@dexter/tacocat-consonant-templates').PriceLiterals;

type RequiredKey<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

declare global {
  namespace Commerce {
    type Defaults = Readonly<
      Omit<Commerce.Checkout.Settings & Commerce.Wcs.Settings, 'locale'>
    >;

    type Env = ProviderEnvironment;

    type getLocaleSettings = (
      config?: Pick<MiloConfig, 'locale'>
    ) => Omit<Settings, 'env'>;

    type getSettings = (config?: MiloConfig) => Checkout.Settings & Wcs.Settings;

    type init = (callback?: () => MiloConfig, force?: boolean) => Promise<Instance>;

    type pollImsCountry = (options?: {
      interval?: number;
      maxAttempts?: number;
    }) => Promise<string | void>;

    type providePriceOptions = (
      element: HTMLInlinePriceElement,
      options: Record<string, any>
    ) => void;

    type reset = () => void;

    interface Instance {
      readonly checkout: Checkout.Client;
      readonly defaults: Defaults;
      readonly ims: Ims.Client;
      readonly providers: {
        /**
         * Registers price options provider - a function accepting
         * price options object and modifying it as needed in specific context.
         */
        price(provider: providePriceOptions): () => void;
      };
      readonly literals: Literals;
      readonly settings: Checkout.Settings & Wcs.Settings;
      readonly wcs: Wcs.Client;
    }

    interface Literals {
      price: Record<string, string>;
    }

    interface MiloConfig {
      commerce?: Partial<
        Record<keyof Checkout.Settings | keyof Wcs.Settings, any>
      >;
      env?: {
        name: string;
      };
      locale?: {
        ietf?: string;
        prefix?: string;
      };
    }

    interface Settings {
      country: string;
      env: Env;
      language: string;
      locale: string;
    }

    interface HTMLPlaceholderMixin {
      init(): void;
      onceSettled(): Promise<HTMLPlaceholderMixin>;
      render(overrides?: Record<string, any>): void;
      toggleFailed(version: number, error?: Error): boolean;
      togglePending(): number;
      toggleResolved(version: number): boolean;
    }

    interface HTMLCheckoutLinkElement extends HTMLPlaceholderMixin, HTMLAnchorElement {
      renderOffers(offers: Wcs.Offer[], overrides?: Record<string, any>): void;
    }

    interface HTMLInlinePriceElement extends HTMLPlaceholderMixin, HTMLSpanElement {
      new(): HTMLInlinePriceElement;
      renderOffer(offer: Wcs.Offer, overrides?: Record<string, any>): void;
    }

    module Checkout {
      type buildUrl = (options: Options) => string;
      type Workflow = CheckoutType;

      interface Client {
        /**
         * Returns checkout url string for given product offers and checkout options.
         */
        buildUrl: buildUrl;
      }

      interface Options extends CheckoutData {
        checkoutPromoCode: string;
        workflow: Workflow;
      }

      interface Settings extends Commerce.Settings {
        checkoutClientId: string;
        checkoutWorkflow: Workflow;
        checkoutWorkflowStep: WorkflowStep;
      }
    }

    module Ims {
      interface Client {
        /**
         * A promise resolving with country code configured for current user in IMS.
         */
        get country(): Promise<string | void>;
      }
    }

    module Internal {
      interface Instance extends Omit<Commerce.Instance, 'providers'> {
        providers: Providers;
      }

      interface Providers {
        price: Set<Commerce.providePriceOptions>
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

      interface Root {
        commerce: Instance;
        level: Record<Level, string>;
        milo: Instance;
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

    module Wcs {
      type PlanType = 'ABM' | 'PUF' | 'M2M' | 'PERPETUAL';
      type Env = Environment;

      interface Client {
        /**
         * Resolves requested list of "Offer Selector Ids" (`osis`) from Wcs or local cache.
         * Returns one promise per osi, the promise resolves to array of product offers
         * associated with this osi.
         * 
         * If `multiple` is set to false (this is default value), resolved array will contain only one
         * offer, selected by country/language-perpetual algorithm.
         * Otherwise. all responded offers are returned.
         * 
         * If `taxExclusive` is set to true (default value defined in settings),
         * then returned prices are transformed into tax exclusive variant.
         */
        resolveOfferSelectors(options: {
          multiple?: boolean;
          offerSelectorIds: string[];
          perpetual?: boolean;
          promotionCode?: string;
          taxExclusive?: boolean;
        }): Promise<Offer[]>[];
      }

      interface Offer extends ResolvedOffer {
        planType: PlanType;
        priceDetails: PriceDetails & {
          priceWithoutDiscount?: number;
          priceWithoutDiscountAndTax?: number;
          priceWithoutTax?: number;
        }
      }

      interface Settings extends Commerce.Settings {
        wcsApiKey: string;
        wcsBufferDelay: number;
        wcsBufferLimit: number;
        wcsEnv: Env;
        wcsForceTaxExclusive: boolean;
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
    }
  }
}

export declare const CheckoutWorkflow: Commerce.Checkout.Workflow;
export declare const CheckoutWorkflowStep: WorkflowStep;
/**
 * Default values for commerce module settings.
 */
export declare const defaults: Commerce.Defaults;
export declare const Env: Commerce.Env;
export declare const HTMLCheckoutLinkElement: Commerce.HTMLCheckoutLinkElement; 
export declare const HTMLInlinePriceElement: Commerce.HTMLInlinePriceElement;
export declare const HTMLPlaceholderMixin: Commerce.HTMLPlaceholderMixin
export declare const Log: Commerce.Log.Root;
export declare const WcsEnv: Commerce.Wcs.Env;
export declare const WcsLandscape: Landscape;
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
/**
 * Disposes shared instance of `commerce` module and enables subsequent re-`init`.
 * 
 * Useful in tests.
 */
export declare const reset: Commerce.reset;
