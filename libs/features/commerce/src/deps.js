import {
  CheckoutType,
  WorkflowStep,
  buildCheckoutUrl,
} from '@pandora/commerce-checkout-url-builder';
import {
  Environment,
  Landscape,
  ProviderEnvironment,
} from '@pandora/data-source-utils';
import {
  price,
  pricePromo,
  priceOptical,
  priceStrikethrough,
} from '@dexter/tacocat-consonant-templates';
import { computePromoStatus } from '@dexter/tacocat-core';

const MiloEnv = {
  LOCAL: 'local',
  PROD: 'prod',
  STAGE: 'stage',
};

export {
  CheckoutType as CheckoutWorkflow,
  WorkflowStep as CheckoutWorkflowStep,
  ProviderEnvironment as Env,
  Environment as WcsEnv,
  Landscape as WcsLandscape,
  MiloEnv,
  buildCheckoutUrl,
  computePromoStatus,
  price,
  pricePromo,
  priceOptical,
  priceStrikethrough,
}
