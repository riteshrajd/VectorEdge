const BASE_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL || '';

export const FETCH_TICK_DATA_API_ROUTE = `${BASE_URL}/api/ticker-data`
export const SEARCH_TICK_API_ROUTE = `${BASE_URL}/api/ticker-search`