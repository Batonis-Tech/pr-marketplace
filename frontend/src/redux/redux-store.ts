import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from './reducers/UserReducer/UserSlice'
import {filterTextAPI} from "./services/FilterTextService";
import filtersReducer from "./reducers/FiltersReducer/FiltersSlice";
import catalogReducer from "./reducers/CatalogReducer/CatalogSlice";
import {platformPageAPI} from "./services/PlatformPageService";
import {platformsService} from "./services/PlatformsService";

let rootReducer = combineReducers({
    userReducer,
    filtersReducer,
    catalogReducer,
    [filterTextAPI.reducerPath]: filterTextAPI.reducer,
    [platformPageAPI.reducerPath]: platformPageAPI.reducer,
    [platformsService.reducerPath]: platformsService.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(filterTextAPI.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
