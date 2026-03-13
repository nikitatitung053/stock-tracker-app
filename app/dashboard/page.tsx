import Link from "next/link"

export default function Dashboard(){

const stocks=[
{symbol:"AAPL",price:185},
{symbol:"TSLA",price:210},
{symbol:"MSFT",price:390}
]

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
User Dashboard
</h1>

<h2 className="text-xl mb-4">
Top Stocks
</h2>

<table className="table-auto border w-full">

<thead>
<tr>
<th className="border px-4 py-2">Stock</th>
<th className="border px-4 py-2">Price</th>
</tr>
</thead>

<tbody>

{stocks.map((stock)=>(
<tr key={stock.symbol}>
<td className="border px-4 py-2">
{stock.symbol}
</td>
<td className="border px-4 py-2">
${stock.price}
</td>
</tr>
))}

</tbody>

</table>

</div>
)
}