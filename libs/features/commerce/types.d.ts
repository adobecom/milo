declare namespace Commerce {
  type CheckoutData = import('@pandora/commerce-checkout-url-builder').CheckoutData;
  type CheckoutWorkflow = import('@pandora/commerce-checkout-url-builder').CheckoutType;
  type CheckoutWorkflowStep = import('@pandora/commerce-checkout-url-builder').WorkflowStep;
  type Environment = import('@pandora/data-source-utils').Environment;
  type WcsLandscape = import('@pandora/data-source-utils').Landscape;
  type WcsFetchOptions = import('@pandora/data-source-utils').FetchOptions;
  type WcsProviderEnvironment = import('@pandora/data-source-utils').ProviderEnvironment;
  type WcsQueryOptions = import('@pandora/data-source-utils').QueryOptions;
  type WcsResolvedOffer = import('@pandora/data-models-odm').ResolvedOffer;

  type getLocaleSettings = (config?: Pick<Config, 'locale'>) => Omit<Settings, 'env'>;
  type getSettings = (config?: Config) => Checkout.Settings & Wcs.Settings;
  type init = (callback: () => Config) => Promise<Instance>;
  type pollImsCountry = (options?: {
    interval?: number;
    maxAttempts?: number;
  }) => Promise<string | void>;

  interface Config {
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

  interface Instance {
    checkout: Checkout.Client;
    ims: Ims.Client;
    providers: {
      price(
        provider: (
          element: InlinePriceElement,
          options: Record<string, any>
        ) => void
      ): () => void;
    };
    literals: {
      price: Record<string, string>;
    };
    settings: Checkout.Settings & Wcs.Settings;
    wcs: Wcs.Client;
  }

  interface Settings {
    country: string;
    env: WcsProviderEnvironment;
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

  interface CheckoutLinkElement extends PLaceholderElement, HTMLSpanElement {}
  interface InlinePriceElement extends PLaceholderElement, HTMLSpanElement {}

  module Checkout {
    interface Client {
      buildUrl(options: CheckoutData & {
        workflow: CheckoutWorkflow
      }): string;
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

    type getClient = (settings: Settings) => Client;

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
      wcsDebounceDelay: Number;
      wcsEnvironment: Environment;
      wcsForceTaxExclusive: boolean;
      wcsLandscape: WcsLandscape;
      wcsOfferSelectorLimit: Number;
    }
  }
}
