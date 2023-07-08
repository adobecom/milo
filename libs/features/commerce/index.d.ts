import { CheckoutData, CheckoutType, WorkflowStep } from '@pandora/commerce-checkout-url-builder';
import { ProviderEnvironment, Landscape, Environment } from '@pandora/data-source-utils';
import { ResolvedOffer } from '@pandora/data-models-odm';

// TODO: expose this type from @dexter/tacocat-consonant-templates package
// type PriceLiterals = import('@dexter/tacocat-consonant-templates').PriceLiterals;

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
    type init = (callback: () => MiloConfig) => Promise<Instance>;
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
      onceResolved(): Promise<HTMLPlaceholderMixin>;
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
      type Workflow = CheckoutType;
      interface Client {
        buildUrl(options: Options): string;
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
         * Creates and returns new instance of `Log` module
         * bound to `name` of the logging module.
         * 
         * New instance will use `name` in namespace of its records.
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
        common: Instance;
        level: Record<Level, string>;
        consoleAppender: Plugin;
        debugFilter: Plugin;
        quietFilter: Plugin;
        lanaAppender: Plugin;
        /**
         * Registers built-in log plugins suitable for provided `env`.
         * @param env Milo `config.env` object.
         */
        init(env?: { name: string }): void;
        /**
         * De-registers all log plugins.
         */
        reset(): void;
        /**
         * Registers provided log plugins.
         */
        use(...plugins: Plugin[]): void;
      }
    }

    module Wcs {
      type PlanType = 'ABM' | 'PUF' | 'M2M' | 'PERPETUAL';
      type Env = Environment;

      interface Client {
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
      }

      interface Settings extends Commerce.Settings {
        wcsApiKey: string;
        wcsDebounceDelay: number;
        wcsEnv: Env;
        wcsForceTaxExclusive: boolean;
        wcsLandscape: Landscape;
        wcsOfferSelectorLimit: number;
      }
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
 * of Commerce module to subsequent calls to `init`, until `reset`.
 */
export declare const init: Commerce.init;
/**
 * Disposes shared instance of `commerce` module and enables subsequent re-`init`.
 * 
 * Useful in tests.
 */
export declare const reset: Commerce.reset;
