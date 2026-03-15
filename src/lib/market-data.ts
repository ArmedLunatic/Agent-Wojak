export interface MarketData {
  solPrice: number | null;
  sol24hChange: number | null;
  trendingCoins: string[] | null;
  fearGreedIndex: number | null;
  fearGreedLabel: string | null;
}

const TIMEOUT_MS = 3000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSolPrice(): Promise<{ price: number | null; change: number | null }> {
  try {
    const res = await fetchWithTimeout(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
      {
        headers: process.env.COINGECKO_API_KEY
          ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
          : {},
      }
    );
    const data = await res.json();
    return {
      price: data.solana?.usd ?? null,
      change: data.solana?.usd_24h_change ?? null,
    };
  } catch (err) {
    console.warn("Failed to fetch SOL price:", err);
    return { price: null, change: null };
  }
}

async function fetchTrendingCoins(): Promise<string[] | null> {
  try {
    const res = await fetchWithTimeout(
      "https://api.coingecko.com/api/v3/search/trending",
      {
        headers: process.env.COINGECKO_API_KEY
          ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
          : {},
      }
    );
    const data = await res.json();
    return data.coins?.slice(0, 5).map((c: { item: { symbol: string } }) => c.item.symbol) ?? null;
  } catch (err) {
    console.warn("Failed to fetch trending coins:", err);
    return null;
  }
}

async function fetchFearGreed(): Promise<{ index: number | null; label: string | null }> {
  try {
    const res = await fetchWithTimeout("https://api.alternative.me/fng/");
    const data = await res.json();
    const entry = data.data?.[0];
    return {
      index: entry?.value ? parseInt(entry.value, 10) : null,
      label: entry?.value_classification ?? null,
    };
  } catch (err) {
    console.warn("Failed to fetch Fear & Greed Index:", err);
    return { index: null, label: null };
  }
}

export async function getMarketData(): Promise<MarketData> {
  const [sol, trending, fearGreed] = await Promise.all([
    fetchSolPrice(),
    fetchTrendingCoins(),
    fetchFearGreed(),
  ]);

  return {
    solPrice: sol.price,
    sol24hChange: sol.change,
    trendingCoins: trending,
    fearGreedIndex: fearGreed.index,
    fearGreedLabel: fearGreed.label,
  };
}
