import { useMemo, useState } from 'react'
import './App.css'
import type { CartItem, CampaignRule, ShopItem } from './util/interface/shopItem'
import shoppingList from './util/shopItemList.json'
import Cart from './component/cart'

const campaignRules: CampaignRule[] = [
  { category: 'Electronics', minimumPrice: 2000, discount: 10 },
  { category: 'Home & Kitchen', minimumPrice: 2500, discount: 12 },
  { category: 'Clothing', minimumPrice: 1000, discount: 8 },
  { category: 'Sports & Outdoors', minimumPrice: 1500, discount: 7 },
]

function App() {
  const itemCategories = [...new Set(shoppingList.map((item: ShopItem) => item.category))]
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const categoryCampaigns = useMemo(
    () => new Map(campaignRules.map((rule) => [rule.category, rule])),
    []
  )

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

  const addToCart = (product: ShopItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const changeQuantity = (itemId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const discount = cartItems.reduce((sum, item) => {
    const campaign = categoryCampaigns.get(item.category)
    if (!campaign) {
      return sum
    }

    const categoryTotal = cartItems
      .filter((cartItem) => cartItem.category === item.category)
      .reduce((categorySum, categoryItem) => categorySum + categoryItem.price * categoryItem.quantity, 0)

    if (categoryTotal < (campaign.minimumPrice ?? 0)) {
      return sum
    }

    const categoryDiscount = Math.floor((categoryTotal * campaign.discount) / 100)
    return sum + categoryDiscount
  }, 0)

  const total = subtotal - discount

  return (
    <div className="w-full h-screen grid grid-cols-[70fr_30fr] gap-4 bg-slate-950 p-4">
      <div className="bg-slate-900 rounded-3xl p-6 flex flex-col overflow-hidden border border-slate-800">
        <div className="mb-6">
          <p className="text-2xl font-bold text-white tracking-tight">Shop</p>
          <p className="text-slate-400 text-sm mt-1">{filteredList.length} items</p>
        </div>

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

        <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2">
          {filteredList.map((item: ShopItem) => {
            const campaign = categoryCampaigns.get(item.category)
            return (
              <div
                key={item.id}
                className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex flex-col h-full justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-emerald-400/80 font-semibold">
                      {item.category}
                    </p>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                    <p className="text-base font-semibold text-white mt-3 leading-snug">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                    {campaign ? (
                      <p className="mt-2 text-xs text-emerald-300">
                        Save {campaign.discount}% on {campaign.category} orders over ฿{campaign.minimumPrice?.toLocaleString()}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <span className="text-lg font-bold text-white">
                      ฿{item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Cart
        cartItems={cartItems}
        subtotal={subtotal}
        discount={discount}
        total={total}
        campaignRules={campaignRules}
        onRemove={removeFromCart}
        onQuantityChange={changeQuantity}
      />
    </div>
  )
}

export default App
