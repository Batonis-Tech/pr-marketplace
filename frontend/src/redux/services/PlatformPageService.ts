import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {IPlatform} from "../../models/IPlatform";

export const platformPageAPI = createApi({
    reducerPath: "getPlatformPage",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_DEV_BACKEND_URL,
        prepareHeaders(headers) {
            headers.set("authorization", `Bearer ${localStorage.getItem("token")}`)
            return headers;
        },
        credentials: "include"
    }),
    endpoints: (build) => ({
        fetchPlatformPage: build.query<IPlatform, string | undefined>({
            query: (idPlatform) => ({
                url: `providers/${idPlatform}`,
            })
        })
    })
})