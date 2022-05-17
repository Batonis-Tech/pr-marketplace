import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IPlatform} from "../../../models/IPlatform";

interface apiPlatforms {
    count?: number
    next?: string | null
    previous?: string | null
    results: IPlatform[]
}

interface CatalogState  extends apiPlatforms{
    isFetching: boolean
    error: string | null
}

const initialState: CatalogState = {
    results: [],
    isFetching: false,
    error: ""
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        getPlatformsFetching(state){
            state.isFetching = true
        },
        getPlatformsFetchingSuccess(state, action: PayloadAction<apiPlatforms>){
            return {...action.payload, error: "", isFetching: false}
        },
        getPlatformsFetchingError(state, action: PayloadAction<string>){
            state.isFetching = false
            state.error = action.payload
        },
    }
})

export default catalogSlice.reducer;