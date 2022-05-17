import {IOptionForProduct} from "./IBasketItem";

export interface IProduct{
    id: number
    price: string | null
    price_currency: string | null
    provider: number | null
    options: IOptionForProduct[]
    type: {id: number, name: string | null}
}