export interface CampaignRule {
  category: string
  minimumPrice?: number
  discount: number
}

export interface ShopItem {
  id: number
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
}

export interface CartItem extends ShopItem {
  quantity: number
}
