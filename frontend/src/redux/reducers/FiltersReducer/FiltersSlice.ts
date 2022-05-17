import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IFilterValue} from "../../../models/IFilterValue";

export type IKeysForMultiSelect = keyof FiltersState["multiSelect"]
export type IKeysForInputNumber = keyof FiltersState["inputNumber"]
export type IKeysForMultiSelectRange = keyof FiltersState["multiSelectRange"]
export type IKeysForDropdownBoolean = keyof FiltersState["dropdownBoolean"]
export type IKeysForString = keyof FiltersState["string"]
export type IKeysForBoolean = keyof FiltersState["boolean"]

interface FiltersState{
    showAccordions: number[] | number
    search: string,
    page: number,
    page_size: number,
    multiSelect: {
        allowed_publication_themes: number[] | null
        city: number[] | null
        country: number[] | null
        domains: number[] | null
        announsment: number[] | null
        languages: number[] | null
        state: number[] | null
        themes: number[] | null
        types: number[] | null
        pub_format: number[] | null
    }
    string: {
        keywords: string[]
        aggregators: number[]
    }
    boolean: {
        writing: boolean
    }
    inputNumber: {
        price_max: number | null
        price_min: number | null
        month_old: number | null
        days_to_prod: number | null
        index_IKS_max: number | null
        index_IKS_min: number | null
        links: number | null
        index_traffic_min: number | null
        index_yandex_min: number | null
        index_yandex_max: number | null
        index_google_min: number | null
        index_google_max: number | null
        index_trust_checktrust_min: number | null
        index_trust_checktrust_max: number | null
        index_domain_donors_min: number | null
        index_domain_donors_max: number | null
        index_spam_checktrust_min: number | null
        index_spam_checktrust_max: number | null
        index_organic_traffic_min: number | null
        index_organic_traffic_max: number | null
        index_CF_min: number | null
        index_CF_max: number | null
        index_TF_min: number | null
        index_TF_max: number | null
        index_TR_min: number | null
        index_TR_max: number | null
        index_DR_min: number | null
        index_DR_max: number | null
        index_alexa_rank_min: number | null
        index_alexa_rank_max: number | null
        index_da_moz_min: number | null
        index_da_moz_max: number | null
        index_a_hrefs_min: number | null
        index_a_hrefs_max: number | null
        index_backlinks_min: number | null
        index_backlinks_max: number | null
    }
    //Если вернем мультиселект добавить массив number
    multiSelectRange: {
        index_yandex: {step: number | null, values: number | null}
        index_google: {step: number | null, values: number | null}
        index_trust_checktrust: {step: number | null, values: number | null}
        index_domain_donors: {step: number | null, values: number | null}
        index_spam_checktrust: {step: number | null, values: number | null}
        index_organic_traffic: {step: number | null, values: number | null}
        index_CF: {step: number | null, values: number | null}
        index_TF: {step: number | null, values: number | null}
        index_TR: {step: number | null, values: number | null}
        index_DR: {step: number | null, values: number | null}
        index_alexa_rank: {step: number | null, values: number | null}
        index_da_moz: {step: number | null, values: number | null}
        index_a_hrefs: {step: number | null, values: number | null}
        index_backlinks: {step: number | null, values: number | null}
    }
    dropdownBoolean: {
        advertising_mark: number | null
        finded_link_exchange: number | null
        writing: number | null
        yandex_news: number | null
        google_news: number | null
    }
}

const initialState: FiltersState = {
    showAccordions: [0],
    search: "",
    page: 0,
    page_size: 10,
    multiSelect: {
        allowed_publication_themes: null,
        city: null,
        country: null,
        domains: null,
        announsment: null,
        languages: null,
        state: null,
        themes: null,
        types: null,
        pub_format: null
    },
    string: {
        keywords: [],
        aggregators: []
    },
    boolean: {
        writing: false
    },
    inputNumber: {
        price_max: null,
        price_min: null,
        month_old: null,
        days_to_prod: null,
        index_IKS_max: null,
        index_IKS_min: null,
        links: null,
        index_traffic_min: null,
        index_yandex_min: null,
        index_yandex_max: null,
        index_google_min: null,
        index_google_max: null,
        index_trust_checktrust_min: null,
        index_trust_checktrust_max: null,
        index_domain_donors_min: null,
        index_domain_donors_max: null,
        index_spam_checktrust_min: null,
        index_spam_checktrust_max: null,
        index_organic_traffic_min: null,
        index_organic_traffic_max: null,
        index_CF_min: null,
        index_CF_max: null,
        index_TF_min: null,
        index_TF_max: null,
        index_TR_min: null,
        index_TR_max: null,
        index_DR_min: null,
        index_DR_max: null,
        index_alexa_rank_min: null,
        index_alexa_rank_max: null,
        index_da_moz_min: null,
        index_da_moz_max: null,
        index_a_hrefs_min: null,
        index_a_hrefs_max: null,
        index_backlinks_min: null,
        index_backlinks_max: null,
    },
    multiSelectRange: {
        index_yandex: {step: null, values: null},
        index_google: {step: null, values: null},
        index_trust_checktrust: {step: null, values: null},
        index_domain_donors: {step: null, values: null},
        index_spam_checktrust: {step: null, values: null},
        index_organic_traffic: {step: null, values: null},
        index_CF: {step: null, values: null},
        index_TF: {step: null, values: null},
        index_TR: {step: null, values: null},
        index_DR: {step: null, values: null},
        index_alexa_rank: {step: null, values: null},
        index_da_moz: {step: null, values: null},
        index_a_hrefs: {step: null, values: null},
        index_backlinks: {step: null, values: null}
    },
    dropdownBoolean: {
        advertising_mark: null,
        finded_link_exchange: null,
        writing: null,
        yandex_news: null,
        google_news: null
    }
}

export const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setValueMultiSelect(state, action: PayloadAction<{nameFilter: IKeysForMultiSelect, value: number[] | null }>){
            state.multiSelect[action.payload.nameFilter] = action.payload.value
        },
        setValueInputNumber(state, action: PayloadAction<{nameFilter: IKeysForInputNumber, value: number | null}>){
            state.inputNumber[action.payload.nameFilter] = action.payload.value
        },
        setValueDropdownBoolean(state, action: PayloadAction<{nameFilter: IKeysForDropdownBoolean, value: number | null}>){
            state.dropdownBoolean[action.payload.nameFilter] = action.payload.value
        },
        setValueMultiSelectRange(state, action: PayloadAction<{nameFilter: IKeysForMultiSelectRange, value: number, step: number }>){
            state.multiSelectRange[action.payload.nameFilter].values = action.payload.value
            state.multiSelectRange[action.payload.nameFilter].step = action.payload.step
        },
        setValueWriting(state, action: PayloadAction<boolean>){
            state.boolean.writing = action.payload
        },
        setValueAggregators(state, action: PayloadAction<number[]>){
            state.string.aggregators = action.payload
        },
        setValueKeywords(state, action: PayloadAction<string[]>){
            state.string.keywords = action.payload
        },
        setShowAccordions(state, action: PayloadAction<number[] | number>){
            state.showAccordions = action.payload
        },
        setValueSearch(state, action: PayloadAction<string>){
            state.search = action.payload
        },
        setPage(state, action: PayloadAction<number>){
            state.page = action.payload
        },
        setPageSize(state, action: PayloadAction<number>){
            state.page_size = action.payload
        },
        resetFilters(){
           return initialState
        }
    }
})

export default filtersSlice.reducer;
