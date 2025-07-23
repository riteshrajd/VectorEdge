'use client'

import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [quote, setQuote] = useState({
    bid: null as number | null,
    ask: null as number | null,
    lastPrice: null as number | null,
    change: null as number | null,
    changePercent: null as number | null,
    volume: null as number | null,
    high: null as number | null,
    low: null as number | null,
    timestamp: null as number | null
  })

  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null)
  const prevPriceRef = useRef<number | null>(null)

  const formatNumber = (num: number | null, decimals = 5) => 
    num === null ? '-.-----' : num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  const formatVolume = (vol: number | null) =>
    vol === null ? '---' : vol.toLocaleString()

  const formatChange = (val: number | null) => {
    if (val === null) return { text: '-.-----', color: 'text-gray-400' }
    const color = val >= 0 ? 'text-[#49a895]' : 'text-red-400'
    const sign = val >= 0 ? '+' : ''
    return { text: `${sign}${val.toFixed(5)}`, color }
  }

  const formatChangePercent = (val: number | null) => {
    if (val === null) return { text: '-.---%', color: 'text-gray-400' }
    const color = val >= 0 ? 'text-[#49a895]' : 'text-red-400'
    const sign = val >= 0 ? '+' : ''
    return { text: `${sign}${val.toFixed(2)}%`, color }
  }

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'As of --- at --:-- GMT+5:30'
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    return `As of ${isToday ? 'today' : date.toLocaleDateString()} at ${date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    })} GMT+5:30`
  }

  useEffect(() => {
    const socket = new WebSocket(
      'wss://data.tradingview.com/socket.io/websocket?from=symbols%2FEURUSD%2F&date=2025-07-15T11%3A30%3A28'
    )

    const session = 'qs_' + Math.random().toString(36).substring(2, 12)

    const send = (msg: object) =>
      socket.send(`~m~${JSON.stringify(msg).length}~m~${JSON.stringify(msg)}`)

    socket.onopen = () => {
      setConnectionStatus(true);
      send({ m: 'quote_create_session', p: [session] })
      send({ m: 'quote_add_symbols', p: [session, 'GBEBROKERS:EURUSD'] })
    }

    socket.onmessage = (event) => {
      const parseTradingViewData = (rawData: string) => {
        const chunks = []
        let data = rawData
        console.log(`data: ${data}`)
        
        while (data.length > 0) {
          const match = data.match(/~m~(\d+)~m~/)
          if (!match) break
          
          const length = parseInt(match[1])
          const start = match.index! + match[0].length
          const end = start + length
          
          if (end > data.length) break
          
          chunks.push(data.substring(start, end))
          data = data.substring(end)
        }
        
        return chunks
      }

      const chunks = parseTradingViewData(event.data)
      
      chunks.forEach(chunk => {
        if (chunk.startsWith('~h~')) return

        try {
          const parsed = JSON.parse(chunk)
          if (parsed.m === 'qsd' && parsed.p?.[1]?.n === 'GBEBROKERS:EURUSD') {
            const update: Partial<typeof quote> = {}
            const quoteData = parsed.p[1].v
            
            if (quoteData.bid !== undefined) update.bid = quoteData.bid
            if (quoteData.ask !== undefined) update.ask = quoteData.ask
            if (quoteData.lp !== undefined) {
              update.lastPrice = quoteData.lp
              
              // Check for price change and trigger flash
              if (prevPriceRef.current !== null && quoteData.lp !== prevPriceRef.current) {
                setPriceFlash(quoteData.lp > prevPriceRef.current ? 'up' : 'down')
                setTimeout(() => setPriceFlash(null), 400)
              }
              prevPriceRef.current = quoteData.lp
            }
            if (quoteData.ch !== undefined) update.change = quoteData.ch
            if (quoteData.chp !== undefined) update.changePercent = quoteData.chp
            if (quoteData.volume !== undefined) update.volume = quoteData.volume
            if (quoteData.high_price !== undefined) update.high = quoteData.high_price
            if (quoteData.low_price !== undefined) update.low = quoteData.low_price
            if (quoteData.lp_time !== undefined) update.timestamp = quoteData.lp_time
            
            setQuote(prev => ({ ...prev, ...update }))
          }
        } catch (e) {
          // Silently ignore parsing errors
        }
      })
    }

    socket.onerror = (error) => {
      console.error(error)
      setConnectionStatus(false);
    }

    socket.onclose = () => {
      setConnectionStatus(false);
    }

    return () => {
      socket.close()
      setConnectionStatus(false);
    }
  }, [])

  const change = formatChange(quote.change)
  const changePercent = formatChangePercent(quote.changePercent)

  return (
    <div className="min-h-screen bg-black text-white font-quicksand">
      <p className={`${connectionStatus ? 'text-[#49a895]' : 'text-red-400'}`}>{connectionStatus ? 'Connected' : 'Disconnected'}</p>
      {/* Header */}
      <div className="border-b border-white/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">📈 TradingView</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              30-day free trial
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Currency Header */}
        <div className="flex items-center space-x-6 mb-8">
          {/* Currency Flags */}
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 rounded-full bg-blue-600/80 flex items-center justify-center relative">
              <div className="text-yellow-400 text-sm">★★★★★</div>
              <div className="absolute inset-0 rounded-full bg-blue-600 opacity-80"></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-red-700/80 flex items-center justify-center relative -ml-4">
              <div className="text-white text-xs">🇺🇸</div>
            </div>
          </div>

          {/* Currency Info */}
          <div className="flex-1">
            <h1 className="text-4xl mb-2 text-white/90">Euro / U.S. Dollar</h1>
            <div className="flex items-center space-x-4">
              <div className="border-1 border-white/50 px-3 py-1 rounded flex items-center space-x-2 text-white/80">
                <span className="text-sm">EURUSD</span>
                <span className="text-xs">•</span>
                <span className="text-xs">🏢 FXCM</span>
              </div>
              <div className='w-8 h-8 bg-[#49a895]/15 rounded-md flex justify-center items-center'>
                <div className="w-2 h-2 bg-[#49a895] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* See on Supercharts button */}
          <div className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 cursor-pointer">
            See on Supercharts
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-8">
          <div className="flex items-baseline space-x-6 font-bold">
            <div className={`text-6xl font-bold transition-colors duration-200 ${
              priceFlash === 'up' ? 'text-[#49a895]' : 
              priceFlash === 'down' ? 'text-red-400' : 'text-white'
            }`}>
              {formatNumber(quote.lastPrice)}
              <span className="text-2xl text-gray-400 ml-2">USD</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-xl ${change.color}`}>
                {change.text}
              </span>
              <span className={`text-xl ${changePercent.color}`}>
                {changePercent.text}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {formatTime(quote.timestamp)}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex space-x-8">
            {['Overview', 'News', 'Ideas', 'Discussions', 'Technicals', 'Seasonals', 'Economic Calendar'].map((tab, index) => (
              <div key={tab} className={`py-3 px-1 border-b-2 cursor-pointer ${
                index === 0 ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}>
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* Trading Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bid/Ask */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Bid / Ask</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Bid</span>
                <span className="font-mono text-lg">{formatNumber(quote.bid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ask</span>
                <span className="font-mono text-lg">{formatNumber(quote.ask)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Spread</span>
                <span className="font-mono text-lg">
                  {quote.bid && quote.ask ? formatNumber(quote.ask - quote.bid) : '-.-----'}
                </span>
              </div>
            </div>
          </div>

          {/* Daily Range */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Daily Range</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">High</span>
                <span className="font-mono text-lg text-[#49a895]">{formatNumber(quote.high)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low</span>
                <span className="font-mono text-lg text-red-400">{formatNumber(quote.low)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Range</span>
                <span className="font-mono text-lg">
                  {quote.high && quote.low ? formatNumber(quote.high - quote.low) : '-.-----'}
                </span>
              </div>
            </div>
          </div>

          {/* Volume */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Volume</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Volume</span>
                <span className="font-mono text-lg">{formatVolume(quote.volume)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Volume</span>
                <span className="font-mono text-lg text-gray-500">---</span>
              </div>
            </div>
          </div>

          {/* Market Status */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Market Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[#49a895]">Open</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Close</span>
                <span className="text-sm text-gray-500">Friday 22:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">1D</span>
                <span className={`${changePercent.color}`}>{changePercent.text}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">1W</span>
                <span className="text-gray-500">---</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">1M</span>
                <span className="text-gray-500">---</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Technical</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">RSI (14)</span>
                <span className="text-gray-500">---</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MACD</span>
                <span className="text-gray-500">---</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MA (20)</span>
                <span className="text-gray-500">---</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Last Update</h3>
            <div className="text-sm text-gray-400">
              <div>Real-time data</div>
              <div className="mt-2">{formatTime(quote.timestamp)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}