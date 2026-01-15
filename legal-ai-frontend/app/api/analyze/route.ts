import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const res = await fetch("http://127.0.0.1:8000/analyze-contract", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const text = await res.text()
      return new NextResponse(text, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: "Backend unreachable" }),
      { status: 500 }
    )
  }
}
