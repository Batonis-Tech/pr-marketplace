import {IFilterValue} from "./IFilterValue";
import {finished} from "stream";
import {IImage} from "./IImage";
import {IProduct} from "./IProduct";

export interface IPlatform{
    advertising_mark?: boolean | null
    aggregators?: IFilterValue[] | null
    allowed_publication_themes?: IFilterValue[] | null
    announsment?: number | null
    birthday: string | null
    city?: IFilterValue[] | null
    country?: IFilterValue[] | null
    created_at: string | null
    days_to_prod?: number | null
    description?: string
    domains?: IFilterValue[] | null
    finded_link_exchange?: boolean | null
    id?: number | null
    index_CF?: number | null
    index_DR?: number | null
    index_IKS?: number | null
    index_TF?: number | null
    index_TR?: number | null
    index_a_hrefs?: number | null
    index_alexa_rank?: number | null
    index_backlinks?: number | null
    index_da_moz?: number | null
    index_domain_donors?: number | null
    index_google?: number | null
    index_google_news?: number | null
    index_organic_traffic?: number | null
    index_spam_checktrust?: number | null
    index_traffic?: number | null
    index_trust_checktrust?: number | null
    index_yandex?: number | null
    index_yandex_news?: number | null
    is_active?: boolean | null
    keywords?: IFilterValue[] | null
    languages?: IFilterValue[] | null
    links?: number | null
    logo: IImage | null
    name: string | null
    products: IProduct[] | null
    state?: IFilterValue[] | null
    status?: string
    themes?: IFilterValue[] | null
    types?: IFilterValue[] | null
    url: string | null
    user: number | null
    writing?: boolean | null
}