import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {IFilterValueResponse} from "../../models/IFilterValue";

interface fetchTextFilterQueryProps {
    path: string
    page: number
    page_size: number
    country?: number[] | null
    state?: number[] | null
}

export const filterTextAPI = createApi({
    reducerPath: "getFilterTextAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_DEV_BACKEND_URL,
        prepareHeaders(headers) {
            headers.set("authorization", `Bearer ${localStorage.getItem("token")}`)
            return headers;
        },
        credentials: "include"
    }),
    endpoints: (build) => ({
        fetchTextFilter: build.query<IFilterValueResponse, fetchTextFilterQueryProps>({
            query: (props) => ({
                url: props.path,
                params: {
                    page: props.page,
                    page_size: props.page_size,
                    country: props.country,
                    state: props.state
                }
            })
        })
    })
})
