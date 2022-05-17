import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {IFilterValueResponse} from "../../models/IFilterValue";
import {catalogAPI} from "../../api/api";

export const platformsService = createApi({
    reducerPath: "platformsService",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_DEV_BACKEND_URL,
    }),
    endpoints: (build) => ({
        getPlatforms: build.query<any, string | null>({
            queryFn(arg, queryApi, extraOptions, baseQuery){
                catalogAPI.getPlatforms(arg)
                    .then(response => {
                        return {data: {totalCount: response.data.count, platforms: response.data.results}}
                    })
                    .catch(error => {
                        return {error: error.message}
                    })
                return {
                    error: {
                        status: 500,
                        statusText: 'Internal Server Error',
                        data: "Coin landed on it's edge!",
                    },
                }
            }
        })
    })
})