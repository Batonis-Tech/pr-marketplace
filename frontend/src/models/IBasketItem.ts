export interface IBasketItem{
    product: number
    provider?: number
    user?: number
    options:IOptionForProduct[]
}

export interface IOptionForProduct {
    option: number,
    quantity: number,
    name?: string,
    price?: string
}

export interface IBasketItemForLS {
    product: number
    quill_task?: string
    options: number[]
}