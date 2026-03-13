import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get("symbol")

  const API_KEY = process.env. NEXT_PUBLIC_FINNHUB_API_KEY

  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
  )

  const data = await res.json()

  console.log("Finnhub response:", data)

  return NextResponse.json({
    price: data.c || null
  })
}