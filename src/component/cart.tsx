import type { CartItem, CampaignRule } from '../util/interface/shopItem'

type CartProps = {
  cartItems: CartItem[]
  subtotal: number
  discount: number
  total: number
  campaignRules: CampaignRule[]
  onRemove: (id: number) => void
  onQuantityChange: (id: number, delta: number) => void
}

export default function Cart({ cartItems, subtotal, discount, total, campaignRules, onRemove, onQuantityChange }: CartProps) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col">
      <div className="mb-4">
        <p className="text-lg font-bold text-white">Cart</p>
        <p className="text-slate-400 text-sm mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm text-center">
          No items yet
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          {cartItems.map((item) => (
            <div key={item.id} className="rounded-3xl bg-slate-800/70 border border-slate-700 p-4">
              <div className="flex items-start gap-3">
                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.category}</p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-slate-300 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuantityChange(item.id, -1)}
                        className="h-8 w-8 rounded-full bg-slate-700 text-slate-200 hover:bg-slate-600"
                      >
                        −
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(item.id, 1)}
                        className="h-8 w-8 rounded-full bg-slate-700 text-slate-200 hover:bg-slate-600"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-white">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-3xl bg-slate-800/70 border border-slate-700 p-4">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="text-emerald-300">-฿{discount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-700 pt-3 text-white font-semibold">
                <span>Total</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-3xl bg-slate-800/70 border border-slate-700 p-4">
        <p className="text-sm font-semibold text-white mb-3">Campaigns</p>
        <div className="space-y-2 text-xs text-slate-400">
          {campaignRules.map((rule) => (
            <p key={rule.category}>
              {rule.category}: {rule.discount}% off orders over ฿{rule.minimumPrice?.toLocaleString()}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
