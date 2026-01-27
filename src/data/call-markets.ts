export interface CallMarket {
  id: string;
  label: string;
  phoneDisplay: string;
  phoneHref: string;
}

export const sanitizePhoneNumberValue = (value: string) => value.replace(/[^0-9+]/g, "");

export const CALL_MARKETS: CallMarket[] = [
  {
    id: "cincinnati",
    label: "Cincinnati",
    phoneDisplay: "513-440-5123",
    phoneHref: "",
  },
].map((market) => ({
  ...market,
  phoneHref: `tel:${sanitizePhoneNumberValue(market.phoneDisplay)}`,
}));

export const DEFAULT_CALL_MARKET = CALL_MARKETS[0] ?? null;
