export interface IBalance{
    balance: string
    balance_currency: string
    bank_BIC: string | null
    bank_name: string | null
    checking_account: string | null
    correspondent_account_number: string | null
    created_at: string
    freezed_amount: string | null
    debited_amount: string | null
    earned_amount: string | null
    exported_amount: string | null
    withdrawed_amount: string | null
    id: number
    payee_name: string | null
    provider: number | null
    tax_number: string | null
    user:number
}