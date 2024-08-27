import { LitElement } from "lit";

declare global {
    namespace Commerce {
        type ComponentConstructor = {
            new(): LitElement;
        }

        type filterOffer = (offer: Offer, index: number) => boolean;
        type filterPlaceholder = (placeholder: Commerce.Placeholder, index: number) => boolean;
        type failed = (error: Error | undefined, target: Element) => void;
        type resolved = (value: any, target: Element) => void;

        type Offers = Map<string, Offer>;

        interface EventDetail {
            error?: Error;
            value?: any;
        }

        interface Offer {
            /** List of checkout links associated with this offer. */
            readonly checkoutLinks: Checkout.Placeholder[];
            /** Common ancestor of all placeholders in this offer, the offer container. */
            readonly container: Element | undefined;
            /** List of inline prices associated with this offer. */
            readonly inlinePrices: Price.Placeholder[];
            /** Payments plan type. */
            readonly planType: Wcs.PlanType | "UNKNOWN";
        }
    }
}

export {};
