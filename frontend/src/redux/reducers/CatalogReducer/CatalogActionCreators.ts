import {AppDispatch} from "../../redux-store";
import {userSlice} from "../UserReducer/UserSlice";
import {catalogAPI, oAuthAPI} from "../../../api/api";
import {getUserData} from "../UserReducer/UserActionCreators";
import {catalogSlice} from "./CatalogSlice";

export const getPlatforms = (query: string) => (dispatch: AppDispatch) => {
    dispatch(catalogSlice.actions.getPlatformsFetching())
    catalogAPI.getPlatforms(query)
        .then(response => {
            dispatch(catalogSlice.actions.getPlatformsFetchingSuccess(response.data))
        })
        .catch(error => {
            dispatch(catalogSlice.actions.getPlatformsFetchingError(error.message))
        })
}