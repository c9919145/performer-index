import type { Country } from "../types";

/**
 * Countries available in the directory. The sample dataset uses a subset of
 * these; the list exists so the UI can render the country filter regardless
 * of which entries the data layer returns.
 */
export const COUNTRIES: Country[] = [
  { code: "US", name: "USA", token: "usa" },
  { code: "CA", name: "Canada", token: "canada" },
  { code: "GB", name: "United Kingdom", token: "united_kingdom" },
  { code: "BR", name: "Brazil", token: "brazil" },
  { code: "MX", name: "Mexico", token: "mexico" },
  { code: "CO", name: "Colombia", token: "colombia" },
  { code: "DE", name: "Germany", token: "germany" },
  { code: "FR", name: "France", token: "france" },
  { code: "ES", name: "Spain", token: "spain" },
  { code: "IT", name: "Italy", token: "italy" },
  { code: "NL", name: "Netherlands", token: "netherlands" },
  { code: "SE", name: "Sweden", token: "sweden" },
  { code: "RU", name: "Russia", token: "russia" },
  { code: "UA", name: "Ukraine", token: "ukraine" },
  { code: "PL", name: "Poland", token: "poland" },
  { code: "JP", name: "Japan", token: "japan" },
  { code: "AU", name: "Australia", token: "australia" },
  { code: "AR", name: "Argentina", token: "argentina" },
];

export const WORLDWIDE = "worldwide";

export function countryByToken(token: string): Country | undefined {
  return COUNTRIES.find((c) => c.token === token);
}

/** Geographic scopes offered by the "Models" dropdown, mirroring the reference. */
export const GEO_FILTERS: Array<{
  token: string;
  label: string;
}> = [
  { token: WORLDWIDE, label: "Worldwide Models" },
  { token: "usa", label: "American Models" },
  { token: "north_america", label: "North American Models" },
];

const NORTH_AMERICA = new Set(["US", "CA", "MX"]);

export function matchesGeoScope(country: Country, geoToken: string): boolean {
  if (geoToken === WORLDWIDE) return true;
  if (geoToken === "usa") return country.code === "US";
  if (geoToken === "north_america") return NORTH_AMERICA.has(country.code);
  return country.token === geoToken;
}
