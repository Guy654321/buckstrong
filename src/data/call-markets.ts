export interface CallMarket {
  id: string;
  label: string;
  phoneDisplay: string;
  phoneHref: string;
}

export const sanitizePhoneNumberValue = (value: string) => value.replace(/[^0-9+]/g, "");

export const CALL_MARKETS: CallMarket[] = [
  {
    id: "louisville",
    label: "Louisville",
    phoneDisplay: "502-619-5198",
    phoneHref: "",
  },
  {
    id: "lexington",
    label: "Lexington",
    phoneDisplay: "859-436-2954",
    phoneHref: "",
  },
  {
    id: "northern-kentucky",
    label: "Northern Kentucky",
    phoneDisplay: "(859) 306-0782",
    phoneHref: "",
  },
].map((market) => ({
  ...market,
  phoneHref: `tel:${sanitizePhoneNumberValue(market.phoneDisplay)}`,
}));

export const DEFAULT_CALL_MARKET = CALL_MARKETS[0] ?? null;
