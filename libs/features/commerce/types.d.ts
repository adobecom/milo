declare namespace Commerce {
  type getSettings = (config: Config) => Checkout.Settings & Wcs.Settings;
  type init = (injector: () => Dependencies) => Promise<Instance>;
  type pollImsCountry = () => Promise<string>;

  interface Config {
    commerce: Partial<Record<keyof Checkout.Settings | keyof Wcs.Settings, any>>;
    env: {
      name: string;
    };
    locale: {
      ietf: string;
      prefix?: string;
    };
  }

  interface Dependencies {
    config: Config;
    loadScript: () => Promise<any>;
  }

  interface Instance {
    imsCountryPromise: Promise<string>;
    literals: Record<string, string>;
    settings: Settings;
    wcs: Wcs.Client;
  }

  interface Settings {
    country: string;
    env: ProviderEnvironment;
    language: string;
    locale: string;
    prod: boolean;
  }

  module Checkout {
    type Workflow =
      import('@pandora/commerce-checkout-url-builder').CheckoutType;
    type WorkflowStep =
      import('@pandora/commerce-checkout-url-builder').WorkflowStep;

    interface Settings extends Commerce.Settings {
      checkoutClientId: string;
      checkoutWorkflow: Workflow;
      checkoutWorkflowStep: WorkflowStep;
    }
  }

  module Log {
    type Factory = {
      (namespace: string): Instance;
      commerce: Instance;
      common: Instance;
      level: {
        debug: 'debug';
        error: 'error';
        info: 'info';
        warn: 'warn';
      };

      consoleWriter: Module;
      debugFilter: Module;
      quietFilter: Module;

      reset({ isProd: boolean }): void;
      use(...modules: Module[]): Factory;
    };

    type Level = 'debug' | 'error' | 'info' | 'warn';

    interface Instance {
      readonly id: string;
      readonly namespace: string;
      debug(message: string, ...params: any[]): void;
      error(message: string, ...params: any[]): void;
      module(name: string): Instance;
      info(message: string, ...params: any[]): void;
      warn(message: string, ...params: any[]): void;
    }

    interface Module {
      filter?(record: Record): boolean;
      writer?(record: Record): void;
    }

    interface Record {
      instance: number;
      level: Level;
      message: string;
      namespace: string;
      params: any[];
      timestamp: number;
    }
  }

  module Wcs {
    type Environment = import('@pandora/data-source-utils').Environment;
    type Landscape = import('@pandora/data-source-utils').Landscape;
    type FetchOptions = import('@pandora/data-source-utils').FetchOptions;
    type ProviderEnvironment =
      import('@pandora/data-source-utils').ProviderEnvironment;
    type QueryOptions = import('@pandora/data-source-utils').QueryOptions;
    type ResolvedOffer = import('@pandora/data-models-odm').ResolvedOffer;

    type PlanType = 'ABM' | 'PUF' | 'M2M' | 'PERPETUAL' | 'UNKNOWN';

    type getClient = (settings: Settings) => Client;

    interface Client {
      resolveOfferSelector(options: {
        isPerpetual?: boolean;
        osi: string;
        promotionCode?: string;
        taxExclusive?: boolean;
      }): Promise<ResolvedOffer[]>;
    }

    interface Settings extends Commerce.Settings {
      wcsApiKey: string;
      wcsDebounceDelay: Number;
      wcsEnvironment: Environment;
      wcsForceTaxExclusive: boolean;
      wcsLandscape: Landscape;
      wcsOfferSelectorLimit: Number;
    }
  }
}
