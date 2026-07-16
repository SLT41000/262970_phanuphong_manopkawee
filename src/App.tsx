import { useState } from 'react'
import './App.css'
import type { ShopItem } from './util/interface/shopItem'
import shoppingList from "./util/shopItemList.json"

function App() {
  const itemCategories = [...new Set(shoppingList.map((item: ShopItem) => item.category))]
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const filteredList =
    selectedCategories.length === 0
      ? shoppingList
      : shoppingList.filter((item: ShopItem) => selectedCategories.includes(item.category))

  return (
    <div className="w-full h-screen grid grid-cols-[70fr_30fr] gap-4 bg-slate-950 p-4">

      <div className="bg-slate-900 rounded-3xl p-6 flex flex-col overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="mb-6">
          <p className="text-2xl font-bold text-white tracking-tight">Shop</p>
          <p className="text-slate-400 text-sm mt-1">{filteredList.length} items</p>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {itemCategories.map((category) => {
            const active = selectedCategories.includes(category)
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2">
          {filteredList.map((item: ShopItem) => (
            <div
              key={item.id}
              className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
            >
              <div className="flex flex-col h-full justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wide text-emerald-400/80 font-semibold">
                    {item.category}
                  </span>
                  <p className="text-base font-semibold text-white mt-1 leading-snug">
                    {item.name}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                  <span className="text-lg font-bold text-white">
                    ฿{item.price.toLocaleString()}
                  </span>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 active:scale-95">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / side panel */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col">
        <h2 className="text-lg font-bold text-white mb-4">Cart</h2>
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm text-center">
          No items yet
        </div>
      </div>

    </div>
  )
}

export default App