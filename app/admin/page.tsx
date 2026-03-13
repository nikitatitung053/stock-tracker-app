"use client"

import { useState } from "react"

export default function Admin(){

const [stock,setStock]=useState("")

const addStock=()=>{
console.log("Stock Added:",stock)
setStock("")
}

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Admin Dashboard
</h1>

<div className="flex gap-4">

<input
value={stock}
onChange={(e)=>setStock(e.target.value)}
placeholder="Stock Symbol"
className="border p-2"
/>

<button
onClick={addStock}
className="bg-blue-500 text-white px-4 py-2 rounded"
>

Add Stock

</button>

</div>

</div>

)
}