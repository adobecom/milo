import {
  CheckoutData,
  CheckoutType as CheckoutWorkflow,
  WorkflowStep as CheckoutWorkflowStep,
} from '@pandora/commerce-checkout-url-builder';
import {
  ProviderEnvironment as Env,
  Landscape as WcsLandscape,
  Environment as WcsEnv,
} from '@pandora/data-source-utils';
import { ResolvedOffer as WcsResolvedOffer } from '@pandora/data-models-odm';

// TODO: expose this type from @dexter/tacocat-consonant-templates package
// type PriceLiterals = import('@dexter/tacocat-consonant-templates').PriceLiterals;

declare global {
  namespace Commerce {
    type Defaults = Readonly<
      Omit<Commerce.Checkout.Settings & Commerce.Wcs.Settings, 'locale'>
    >;
    type getLocaleSettings = (
      config?: Pick<Config, 'locale'>
    ) => Omit<Settings, 'env'>;
    type getSettings = (config?: Config) => Checkout.Settings & Wcs.Settings;
    type init = (callback: () => Config) => Promise<Instance>;
    type pollImsCountry = (options?: {
      interval?: number;
      maxAttempts?: number;
    }) => Promise<string | void>;
    type providePriceOptions = (
      element: HTMLInlinePriceElement,
      options: Record<string, any>
    ) => void;
    type reset = () => void;

    interface Config {
      commerce?: Partial<
        Record<keyof Checkout.Settings | keyof Wcs.Settings, any>
      >;
      locale?: {
        ietf?: string;
        prefix?: string;
      };
    }

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

    interface Root extends Instance {
      init: init;
      reset: reset;
    }

    interface Settings {
      country: string;
      env: Env;
      language: string;
      locale: string;
    }

    interface PLaceholderElement {
      init(): void;
      onceResolved(): Promise<PLaceholderElement>;
      render(): void;
      toggleFailed(reason?: Error): void;
      togglePending(): void;
      toggleResolved(): void;
    }

    interface HTMLCheckoutLinkElement extends PLaceholderElement, HTMLAnchorElement {}
    interface HTMLInlinePriceElement extends PLaceholderElement, HTMLSpanElement {
      new(): HTMLInlinePriceElement;
      renderOffer(offer: WcsResolvedOffer, options: Record<string, any>): void;
    }

    module Checkout {
      interface Client {
        buildUrl(
          options: CheckoutData & {
            workflow: CheckoutWorkflow;
          }
        ): string;
      }

      interface Settings extends Commerce.Settings {
        checkoutClientId: string;
        checkoutWorkflow: CheckoutWorkflow;
        checkoutWorkflowStep: CheckoutWorkflowStep;
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
      type PlanType = 'ABM' | 'PUF' | 'M2M' | 'PERPETUAL' | 'UNKNOWN';
      interface Client {
        resolveOfferSelector(options: {
          isPerpetual?: boolean;
          osi: string;
          promotionCode?: string;
          taxExclusive?: boolean;
        }): Promise<WcsResolvedOffer[]>;
      }

      interface Settings extends Commerce.Settings {
        wcsApiKey: string;
        wcsDebounceDelay: number;
        wcsEnv: WcsEnv;
        wcsForceTaxExclusive: boolean;
        wcsLandscape: WcsLandscape;
        wcsOfferSelectorLimit: number;
      }
    }
  }
}
