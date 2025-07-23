import { TickerInfo } from "../../types/types";

export const tickers: TickerInfo[] = [
  // ——— MEGA-CAP TECH (MAGNIFICENT 7) ———
  { name: "Apple Inc.", symbol: "AAPL", exchange: "NASDAQ", yf: "AAPL", tv: "NASDAQ:AAPL" },
  { name: "Microsoft Corp.", symbol: "MSFT", exchange: "NASDAQ", yf: "MSFT", tv: "NASDAQ:MSFT" },
  { name: "Alphabet Inc. (Class A)", symbol: "GOOGL", exchange: "NASDAQ", yf: "GOOGL", tv: "NASDAQ:GOOGL" },
  { name: "Alphabet Inc. (Class C)", symbol: "GOOG", exchange: "NASDAQ", yf: "GOOG", tv: "NASDAQ:GOOG" },
  { name: "Amazon.com Inc.", symbol: "AMZN", exchange: "NASDAQ", yf: "AMZN", tv: "NASDAQ:AMZN" },
  { name: "Meta Platforms Inc.", symbol: "META", exchange: "NASDAQ", yf: "META", tv: "NASDAQ:META" },
  { name: "NVIDIA Corp.", symbol: "NVDA", exchange: "NASDAQ", yf: "NVDA", tv: "NASDAQ:NVDA" },
  { name: "Tesla Inc.", symbol: "TSLA", exchange: "NASDAQ", yf: "TSLA", tv: "NASDAQ:TSLA" },

  // ——— MAJOR INDICES & POPULAR ETFS ———
  { name: "SPDR S&P 500 ETF Trust", symbol: "SPY", exchange: "ARCA", yf: "SPY", tv: "AMEX:SPY" },
  { name: "Vanguard S&P 500 ETF", symbol: "VOO", exchange: "NYSEARCA", yf: "VOO", tv: "AMEX:VOO" },
  { name: "iShares Core S&P 500 ETF", symbol: "IVV", exchange: "NYSEARCA", yf: "IVV", tv: "AMEX:IVV" },
  { name: "Invesco QQQ Trust", symbol: "QQQ", exchange: "NASDAQ", yf: "QQQ", tv: "NASDAQ:QQQ" },
  { name: "Vanguard Total Stock Market ETF", symbol: "VTI", exchange: "NYSEARCA", yf: "VTI", tv: "AMEX:VTI" },
  { name: "Schwab U.S. Dividend Equity ETF", symbol: "SCHD", exchange: "NYSEARCA", yf: "SCHD", tv: "AMEX:SCHD" },
  { name: "Vanguard Dividend Appreciation ETF", symbol: "VIG", exchange: "NYSEARCA", yf: "VIG", tv: "AMEX:VIG" },
  { name: "Vanguard Value ETF", symbol: "VTV", exchange: "NYSEARCA", yf: "VTV", tv: "AMEX:VTV" },
  { name: "iShares Russell 2000 ETF", symbol: "IWM", exchange: "NYSEARCA", yf: "IWM", tv: "AMEX:IWM" },
  { name: "Vanguard Growth ETF", symbol: "VUG", exchange: "NYSEARCA", yf: "VUG", tv: "AMEX:VUG" },

  // ——— FINANCE & BANKING ———
  { name: "Berkshire Hathaway Inc. (Class B)", symbol: "BRK.B", exchange: "NYSE", yf: "BRK-B", tv: "NYSE:BRK.B" },
  { name: "JPMorgan Chase & Co.", symbol: "JPM", exchange: "NYSE", yf: "JPM", tv: "NYSE:JPM" },
  { name: "Bank of America Corp.", symbol: "BAC", exchange: "NYSE", yf: "BAC", tv: "NYSE:BAC" },
  { name: "Wells Fargo & Company", symbol: "WFC", exchange: "NYSE", yf: "WFC", tv: "NYSE:WFC" },
  { name: "Goldman Sachs Group Inc.", symbol: "GS", exchange: "NYSE", yf: "GS", tv: "NYSE:GS" },
  { name: "Morgan Stanley", symbol: "MS", exchange: "NYSE", yf: "MS", tv: "NYSE:MS" },
  { name: "Citigroup Inc.", symbol: "C", exchange: "NYSE", yf: "C", tv: "NYSE:C" },
  { name: "American Express Company", symbol: "AXP", exchange: "NYSE", yf: "AXP", tv: "NYSE:AXP" },
  { name: "Visa Inc.", symbol: "V", exchange: "NYSE", yf: "V", tv: "NYSE:V" },
  { name: "Mastercard Inc.", symbol: "MA", exchange: "NYSE", yf: "MA", tv: "NYSE:MA" },

  // ——— HEALTHCARE & PHARMACEUTICALS ———
  { name: "Johnson & Johnson", symbol: "JNJ", exchange: "NYSE", yf: "JNJ", tv: "NYSE:JNJ" },
  { name: "Pfizer Inc.", symbol: "PFE", exchange: "NYSE", yf: "PFE", tv: "NYSE:PFE" },
  { name: "UnitedHealth Group Inc.", symbol: "UNH", exchange: "NYSE", yf: "UNH", tv: "NYSE:UNH" },
  { name: "AbbVie Inc.", symbol: "ABBV", exchange: "NYSE", yf: "ABBV", tv: "NYSE:ABBV" },
  { name: "Merck & Co. Inc.", symbol: "MRK", exchange: "NYSE", yf: "MRK", tv: "NYSE:MRK" },
  { name: "Eli Lilly and Company", symbol: "LLY", exchange: "NYSE", yf: "LLY", tv: "NYSE:LLY" },
  { name: "Bristol-Myers Squibb Company", symbol: "BMY", exchange: "NYSE", yf: "BMY", tv: "NYSE:BMY" },
  { name: "Moderna Inc.", symbol: "MRNA", exchange: "NASDAQ", yf: "MRNA", tv: "NASDAQ:MRNA" },

  // ——— CONSUMER DISCRETIONARY ———
  { name: "The Walt Disney Company", symbol: "DIS", exchange: "NYSE", yf: "DIS", tv: "NYSE:DIS" },
  { name: "Nike Inc.", symbol: "NKE", exchange: "NYSE", yf: "NKE", tv: "NYSE:NKE" },
  { name: "McDonald's Corporation", symbol: "MCD", exchange: "NYSE", yf: "MCD", tv: "NYSE:MCD" },
  { name: "Starbucks Corporation", symbol: "SBUX", exchange: "NASDAQ", yf: "SBUX", tv: "NASDAQ:SBUX" },
  { name: "Home Depot Inc.", symbol: "HD", exchange: "NYSE", yf: "HD", tv: "NYSE:HD" },
  { name: "Lowe's Companies Inc.", symbol: "LOW", exchange: "NYSE", yf: "LOW", tv: "NYSE:LOW" },

  // ——— CONSUMER STAPLES ———
  { name: "Walmart Inc.", symbol: "WMT", exchange: "NYSE", yf: "WMT", tv: "NYSE:WMT" },
  { name: "Procter & Gamble Co.", symbol: "PG", exchange: "NYSE", yf: "PG", tv: "NYSE:PG" },
  { name: "The Coca-Cola Company", symbol: "KO", exchange: "NYSE", yf: "KO", tv: "NYSE:KO" },
  { name: "PepsiCo Inc.", symbol: "PEP", exchange: "NASDAQ", yf: "PEP", tv: "NASDAQ:PEP" },
  { name: "Costco Wholesale Corporation", symbol: "COST", exchange: "NASDAQ", yf: "COST", tv: "NASDAQ:COST" },

  // ——— ENERGY ———
  { name: "Exxon Mobil Corporation", symbol: "XOM", exchange: "NYSE", yf: "XOM", tv: "NYSE:XOM" },
  { name: "Chevron Corporation", symbol: "CVX", exchange: "NYSE", yf: "CVX", tv: "NYSE:CVX" },
  { name: "ConocoPhillips", symbol: "COP", exchange: "NYSE", yf: "COP", tv: "NYSE:COP" },

  // ——— SEMICONDUCTORS & TECH HARDWARE ———
  { name: "Advanced Micro Devices Inc.", symbol: "AMD", exchange: "NASDAQ", yf: "AMD", tv: "NASDAQ:AMD" },
  { name: "Intel Corporation", symbol: "INTC", exchange: "NASDAQ", yf: "INTC", tv: "NASDAQ:INTC" },
  { name: "Broadcom Inc.", symbol: "AVGO", exchange: "NASDAQ", yf: "AVGO", tv: "NASDAQ:AVGO" },
  { name: "Qualcomm Inc.", symbol: "QCOM", exchange: "NASDAQ", yf: "QCOM", tv: "NASDAQ:QCOM" },
  { name: "Taiwan Semiconductor Manufacturing", symbol: "TSM", exchange: "NYSE", yf: "TSM", tv: "NYSE:TSM" },
  { name: "Texas Instruments Inc.", symbol: "TXN", exchange: "NASDAQ", yf: "TXN", tv: "NASDAQ:TXN" },
  { name: "Micron Technology Inc.", symbol: "MU", exchange: "NASDAQ", yf: "MU", tv: "NASDAQ:MU" },

  // ——— SOFTWARE & CLOUD ———
  { name: "Oracle Corporation", symbol: "ORCL", exchange: "NYSE", yf: "ORCL", tv: "NYSE:ORCL" },
  { name: "Salesforce Inc.", symbol: "CRM", exchange: "NYSE", yf: "CRM", tv: "NYSE:CRM" },
  { name: "Adobe Inc.", symbol: "ADBE", exchange: "NASDAQ", yf: "ADBE", tv: "NASDAQ:ADBE" },
  { name: "ServiceNow Inc.", symbol: "NOW", exchange: "NYSE", yf: "NOW", tv: "NYSE:NOW" },
  { name: "Palantir Technologies Inc.", symbol: "PLTR", exchange: "NYSE", yf: "PLTR", tv: "NYSE:PLTR" },

  // ——— COMMUNICATION & TELECOM ———
  { name: "Verizon Communications Inc.", symbol: "VZ", exchange: "NYSE", yf: "VZ", tv: "NYSE:VZ" },
  { name: "AT&T Inc.", symbol: "T", exchange: "NYSE", yf: "T", tv: "NYSE:T" },
  { name: "Comcast Corporation", symbol: "CMCSA", exchange: "NASDAQ", yf: "CMCSA", tv: "NASDAQ:CMCSA" },
  { name: "Netflix Inc.", symbol: "NFLX", exchange: "NASDAQ", yf: "NFLX", tv: "NASDAQ:NFLX" },

  // ——— INDUSTRIALS ———
  { name: "Boeing Company", symbol: "BA", exchange: "NYSE", yf: "BA", tv: "NYSE:BA" },
  { name: "Caterpillar Inc.", symbol: "CAT", exchange: "NYSE", yf: "CAT", tv: "NYSE:CAT" },
  { name: "3M Company", symbol: "MMM", exchange: "NYSE", yf: "MMM", tv: "NYSE:MMM" },
  { name: "General Electric Company", symbol: "GE", exchange: "NYSE", yf: "GE", tv: "NYSE:GE" },

  // ——— FINTECH & PAYMENTS ———
  { name: "PayPal Holdings Inc.", symbol: "PYPL", exchange: "NASDAQ", yf: "PYPL", tv: "NASDAQ:PYPL" },
  { name: "Block Inc.", symbol: "SQ", exchange: "NYSE", yf: "SQ", tv: "NYSE:SQ" },

  // ——— ELECTRIC VEHICLES & CLEAN ENERGY ———
  { name: "NIO Inc.", symbol: "NIO", exchange: "NYSE", yf: "NIO", tv: "NYSE:NIO" },
  { name: "Lucid Group Inc.", symbol: "LCID", exchange: "NASDAQ", yf: "LCID", tv: "NASDAQ:LCID" },
  { name: "Rivian Automotive Inc.", symbol: "RIVN", exchange: "NASDAQ", yf: "RIVN", tv: "NASDAQ:RIVN" },

  // ——— MEME STOCKS & RETAIL FAVORITES ———
  { name: "GameStop Corp.", symbol: "GME", exchange: "NYSE", yf: "GME", tv: "NYSE:GME" },
  { name: "AMC Entertainment Holdings Inc.", symbol: "AMC", exchange: "NYSE", yf: "AMC", tv: "NYSE:AMC" },
  { name: "BlackBerry Limited", symbol: "BB", exchange: "NYSE", yf: "BB", tv: "NYSE:BB" },

  // ——— INTERNATIONAL ADRS ———
  { name: "Alibaba Group Holding Limited", symbol: "BABA", exchange: "NYSE", yf: "BABA", tv: "NYSE:BABA" },
  { name: "Tencent Holdings Limited", symbol: "TCEHY", exchange: "OTC", yf: "TCEHY", tv: "OTC:TCEHY" },
  { name: "Baidu Inc.", symbol: "BIDU", exchange: "NASDAQ", yf: "BIDU", tv: "NASDAQ:BIDU" },
  { name: "JD.com Inc.", symbol: "JD", exchange: "NASDAQ", yf: "JD", tv: "NASDAQ:JD" },
  { name: "Spotify Technology S.A.", symbol: "SPOT", exchange: "NYSE", yf: "SPOT", tv: "NYSE:SPOT" },

  // ——— SECTOR ETFS ———
  { name: "Technology Select Sector SPDR Fund", symbol: "XLK", exchange: "NYSEARCA", yf: "XLK", tv: "AMEX:XLK" },
  { name: "Financial Select Sector SPDR Fund", symbol: "XLF", exchange: "NYSEARCA", yf: "XLF", tv: "AMEX:XLF" },
  { name: "Health Care Select Sector SPDR Fund", symbol: "XLV", exchange: "NYSEARCA", yf: "XLV", tv: "AMEX:XLV" },
  { name: "Consumer Discretionary Select Sector SPDR Fund", symbol: "XLY", exchange: "NYSEARCA", yf: "XLY", tv: "AMEX:XLY" },
  { name: "Energy Select Sector SPDR Fund", symbol: "XLE", exchange: "NYSEARCA", yf: "XLE", tv: "AMEX:XLE" },
  { name: "Utilities Select Sector SPDR Fund", symbol: "XLU", exchange: "NYSEARCA", yf: "XLU", tv: "AMEX:XLU" },
  { name: "Industrial Select Sector SPDR Fund", symbol: "XLI", exchange: "NYSEARCA", yf: "XLI", tv: "AMEX:XLI" },
  { name: "Materials Select Sector SPDR Fund", symbol: "XLB", exchange: "NYSEARCA", yf: "XLB", tv: "AMEX:XLB" },
  { name: "Real Estate Select Sector SPDR Fund", symbol: "XLRE", exchange: "NYSEARCA", yf: "XLRE", tv: "AMEX:XLRE" },

  // ——— INTERNATIONAL ETFS ———
  { name: "Vanguard FTSE Emerging Markets ETF", symbol: "VWO", exchange: "NYSEARCA", yf: "VWO", tv: "AMEX:VWO" },
  { name: "iShares MSCI EAFE ETF", symbol: "EFA", exchange: "NYSEARCA", yf: "EFA", tv: "AMEX:EFA" },
  { name: "Vanguard FTSE Europe ETF", symbol: "VGK", exchange: "NYSEARCA", yf: "VGK", tv: "AMEX:VGK" },
  { name: "iShares MSCI Japan ETF", symbol: "EWJ", exchange: "NYSEARCA", yf: "EWJ", tv: "AMEX:EWJ" },
  { name: "iShares MSCI China ETF", symbol: "MCHI", exchange: "NASDAQ", yf: "MCHI", tv: "NASDAQ:MCHI" },

  // ——— BOND ETFS ———
  { name: "iShares Core U.S. Aggregate Bond ETF", symbol: "AGG", exchange: "NYSEARCA", yf: "AGG", tv: "AMEX:AGG" },
  { name: "Vanguard Total Bond Market ETF", symbol: "BND", exchange: "NASDAQ", yf: "BND", tv: "NASDAQ:BND" },
  { name: "iShares 20+ Year Treasury Bond ETF", symbol: "TLT", exchange: "NASDAQ", yf: "TLT", tv: "NASDAQ:TLT" },
  { name: "iShares iBoxx High Yield Corporate Bond ETF", symbol: "HYG", exchange: "NYSEARCA", yf: "HYG", tv: "AMEX:HYG" },

  // ——— COMMODITIES & GOLD ———
  { name: "SPDR Gold Shares", symbol: "GLD", exchange: "NYSEARCA", yf: "GLD", tv: "AMEX:GLD" },
  { name: "iShares Silver Trust", symbol: "SLV", exchange: "NYSEARCA", yf: "SLV", tv: "AMEX:SLV" },
  { name: "United States Oil Fund", symbol: "USO", exchange: "NYSEARCA", yf: "USO", tv: "AMEX:USO" },
  { name: "Invesco DB Commodity Index Tracking Fund", symbol: "DBC", exchange: "NYSEARCA", yf: "DBC", tv: "AMEX:DBC" },

  // ——— CRYPTO-RELATED STOCKS ———
  { name: "Coinbase Global Inc.", symbol: "COIN", exchange: "NASDAQ", yf: "COIN", tv: "NASDAQ:COIN" },
  { name: "MicroStrategy Inc.", symbol: "MSTR", exchange: "NASDAQ", yf: "MSTR", tv: "NASDAQ:MSTR" },
  { name: "Marathon Digital Holdings Inc.", symbol: "MARA", exchange: "NASDAQ", yf: "MARA", tv: "NASDAQ:MARA" },
  { name: "Riot Platforms Inc.", symbol: "RIOT", exchange: "NASDAQ", yf: "RIOT", tv: "NASDAQ:RIOT" },

  // ——— REITS ———
  { name: "Realty Income Corporation", symbol: "O", exchange: "NYSE", yf: "O", tv: "NYSE:O" },
  { name: "American Tower Corporation", symbol: "AMT", exchange: "NYSE", yf: "AMT", tv: "NYSE:AMT" },
  { name: "Prologis Inc.", symbol: "PLD", exchange: "NYSE", yf: "PLD", tv: "NYSE:PLD" },

  // ——— MAJOR INDICES (FOR REFERENCE) ———
  { name: "S&P 500 Index", symbol: "^GSPC", exchange: "INDEX", yf: "^GSPC", tv: "SP:SPX" },
  { name: "Dow Jones Industrial Average", symbol: "^DJI", exchange: "INDEX", yf: "^DJI", tv: "DJ:DJI" },
  { name: "NASDAQ Composite", symbol: "^IXIC", exchange: "INDEX", yf: "^IXIC", tv: "NASDAQ:IXIC" },
  { name: "Russell 2000 Index", symbol: "^RUT", exchange: "INDEX", yf: "^RUT", tv: "RUSSELL:RUT" },
  { name: "VIX Volatility Index", symbol: "^VIX", exchange: "INDEX", yf: "^VIX", tv: "CBOE:VIX" },

  // ——— CURRENCIES (MAJOR PAIRS) ———
  { name: "EUR/USD", symbol: "EURUSD=X", exchange: "FOREX", yf: "EURUSD=X", tv: "FX:EURUSD" },
  { name: "GBP/USD", symbol: "GBPUSD=X", exchange: "FOREX", yf: "GBPUSD=X", tv: "FX:GBPUSD" },
  { name: "USD/JPY", symbol: "USDJPY=X", exchange: "FOREX", yf: "USDJPY=X", tv: "FX:USDJPY" },
  { name: "USD/CAD", symbol: "USDCAD=X", exchange: "FOREX", yf: "USDCAD=X", tv: "FX:USDCAD" },
  { name: "AUD/USD", symbol: "AUDUSD=X", exchange: "FOREX", yf: "AUDUSD=X", tv: "FX:AUDUSD" },

  // ——— CRYPTOCURRENCIES ———
  { name: "Bitcoin USD", symbol: "BTC-USD", exchange: "CRYPTO", yf: "BTC-USD", tv: "BINANCE:BTCUSDT" },
  { name: "Ethereum USD", symbol: "ETH-USD", exchange: "CRYPTO", yf: "ETH-USD", tv: "BINANCE:ETHUSDT" },
  { name: "Binance Coin USD", symbol: "BNB-USD", exchange: "CRYPTO", yf: "BNB-USD", tv: "BINANCE:BNBUSDT" },
  { name: "Cardano USD", symbol: "ADA-USD", exchange: "CRYPTO", yf: "ADA-USD", tv: "BINANCE:ADAUSDT" },
  { name: "Solana USD", symbol: "SOL-USD", exchange: "CRYPTO", yf: "SOL-USD", tv: "BINANCE:SOLUSDT" },
  { name: "XRP USD", symbol: "XRP-USD", exchange: "CRYPTO", yf: "XRP-USD", tv: "BINANCE:XRPUSDT" },
  { name: "Dogecoin USD", symbol: "DOGE-USD", exchange: "CRYPTO", yf: "DOGE-USD", tv: "BINANCE:DOGEUSDT" },
  { name: "Polygon USD", symbol: "MATIC-USD", exchange: "CRYPTO", yf: "MATIC-USD", tv: "BINANCE:MATICUSDT" },
  { name: "Avalanche USD", symbol: "AVAX-USD", exchange: "CRYPTO", yf: "AVAX-USD", tv: "BINANCE:AVAXUSDT" },
  { name: "Chainlink USD", symbol: "LINK-USD", exchange: "CRYPTO", yf: "LINK-USD", tv: "BINANCE:LINKUSDT" },

  // ——— COMMODITIES FUTURES ———
  { name: "Crude Oil WTI", symbol: "CL=F", exchange: "NYMEX", yf: "CL=F", tv: "NYMEX:CL1!" },
  { name: "Gold", symbol: "GC=F", exchange: "COMEX", yf: "GC=F", tv: "COMEX:GC1!" },
  { name: "Silver", symbol: "SI=F", exchange: "COMEX", yf: "SI=F", tv: "COMEX:SI1!" },
  { name: "Natural Gas", symbol: "NG=F", exchange: "NYMEX", yf: "NG=F", tv: "NYMEX:NG1!" },
  { name: "Copper", symbol: "HG=F", exchange: "COMEX", yf: "HG=F", tv: "COMEX:HG1!" },

  // ——— ADDITIONAL POPULAR STOCKS ———
  { name: "Shopify Inc.", symbol: "SHOP", exchange: "NYSE", yf: "SHOP", tv: "NYSE:SHOP" },
  { name: "Zoom Video Communications Inc.", symbol: "ZM", exchange: "NASDAQ", yf: "ZM", tv: "NASDAQ:ZM" },
  { name: "Peloton Interactive Inc.", symbol: "PTON", exchange: "NASDAQ", yf: "PTON", tv: "NASDAQ:PTON" },
  { name: "Roku Inc.", symbol: "ROKU", exchange: "NASDAQ", yf: "ROKU", tv: "NASDAQ:ROKU" },
  { name: "Twilio Inc.", symbol: "TWLO", exchange: "NYSE", yf: "TWLO", tv: "NYSE:TWLO" },
  { name: "Snowflake Inc.", symbol: "SNOW", exchange: "NYSE", yf: "SNOW", tv: "NYSE:SNOW" },
  { name: "Robinhood Markets Inc.", symbol: "HOOD", exchange: "NASDAQ", yf: "HOOD", tv: "NASDAQ:HOOD" },
  { name: "SoFi Technologies Inc.", symbol: "SOFI", exchange: "NASDAQ", yf: "SOFI", tv: "NASDAQ:SOFI" },
  { name: "Uber Technologies Inc.", symbol: "UBER", exchange: "NYSE", yf: "UBER", tv: "NYSE:UBER" },
  { name: "Lyft Inc.", symbol: "LYFT", exchange: "NASDAQ", yf: "LYFT", tv: "NASDAQ:LYFT" },
  { name: "DoorDash Inc.", symbol: "DASH", exchange: "NYSE", yf: "DASH", tv: "NYSE:DASH" },
  { name: "Airbnb Inc.", symbol: "ABNB", exchange: "NASDAQ", yf: "ABNB", tv: "NASDAQ:ABNB" },
  { name: "Pinterest Inc.", symbol: "PINS", exchange: "NYSE", yf: "PINS", tv: "NYSE:PINS" },
  { name: "Snap Inc.", symbol: "SNAP", exchange: "NYSE", yf: "SNAP", tv: "NYSE:SNAP" },
  { name: "Twitter Inc.", symbol: "TWTR", exchange: "NYSE", yf: "TWTR", tv: "NYSE:TWTR" },
  { name: "Unity Software Inc.", symbol: "U", exchange: "NYSE", yf: "U", tv: "NYSE:U" },
  { name: "Roblox Corporation", symbol: "RBLX", exchange: "NYSE", yf: "RBLX", tv: "NYSE:RBLX" },
  { name: "CrowdStrike Holdings Inc.", symbol: "CRWD", exchange: "NASDAQ", yf: "CRWD", tv: "NASDAQ:CRWD" },
  { name: "Datadog Inc.", symbol: "DDOG", exchange: "NASDAQ", yf: "DDOG", tv: "NASDAQ:DDOG" },
  { name: "Okta Inc.", symbol: "OKTA", exchange: "NASDAQ", yf: "OKTA", tv: "NASDAQ:OKTA" },
  { name: "Zscaler Inc.", symbol: "ZS", exchange: "NASDAQ", yf: "ZS", tv: "NASDAQ:ZS" },
  { name: "MongoDB Inc.", symbol: "MDB", exchange: "NASDAQ", yf: "MDB", tv: "NASDAQ:MDB" },
  { name: "Elastic N.V.", symbol: "ESTC", exchange: "NYSE", yf: "ESTC", tv: "NYSE:ESTC" },
  { name: "Splunk Inc.", symbol: "SPLK", exchange: "NASDAQ", yf: "SPLK", tv: "NASDAQ:SPLK" },
  { name: "Atlassian Corporation", symbol: "TEAM", exchange: "NASDAQ", yf: "TEAM", tv: "NASDAQ:TEAM" },
  { name: "Slack Technologies Inc.", symbol: "WORK", exchange: "NYSE", yf: "WORK", tv: "NYSE:WORK" },
  { name: "Workday Inc.", symbol: "WDAY", exchange: "NASDAQ", yf: "WDAY", tv: "NASDAQ:WDAY" },
  { name: "Autodesk Inc.", symbol: "ADSK", exchange: "NASDAQ", yf: "ADSK", tv: "NASDAQ:ADSK" },
  { name: "Intuit Inc.", symbol: "INTU", exchange: "NASDAQ", yf: "INTU", tv: "NASDAQ:INTU" },
  { name: "VMware Inc.", symbol: "VMW", exchange: "NYSE", yf: "VMW", tv: "NYSE:VMW" },
  { name: "Veeva Systems Inc.", symbol: "VEEV", exchange: "NYSE", yf: "VEEV", tv: "NYSE:VEEV" },
  { name: "Zscaler Inc.", symbol: "ZS", exchange: "NASDAQ", yf: "ZS", tv: "NASDAQ:ZS" },
]