import {AppDispatch} from "../../redux-store";
import {userSlice} from "./UserSlice";
import {oAuthAPI, userAPI} from "../../../api/api";
import {IPlatform} from "../../../models/IPlatform";
import {IBalance} from "../../../models/IBalance";

export const login = (email: string, password: string, remember: boolean) => (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.loginFetching())
    oAuthAPI.login(email, password)
        .then(response => {
            if(remember){
                localStorage.setItem("isRemember", "true")
                dispatch(userSlice.actions.setIsRemember(true))
            }else{
                localStorage.setItem("isRemember", "false")
            }
            localStorage.setItem("token", response.data.access_token)
            localStorage.setItem("tokenRefresh", response.data.refresh_token)
            dispatch(userSlice.actions.loginFetchingSuccess())
            dispatch(getUserData())
        })
        .catch(error => {
            if(error.response.status === 400){
                dispatch(userSlice.actions.loginFetchingError("Неправильный email или пароль"))
            }else{
                dispatch(userSlice.actions.loginFetchingError(error.message))
            }
        })
}

export const getMyAccount = (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.getMyProvidersFetching())
    userAPI.getAccounts()
        .then(response => {
            dispatch(userSlice.actions.getMyProvidersFetchingSuccess(response.data.results as IPlatform[]))
        })
        .catch(error => {
            dispatch(userSlice.actions.getMyProvidersFetchingError(error.message))
        })
}

const getMyBalance = (dispatch: AppDispatch, idProvider?: string) => {
    dispatch(userSlice.actions.getMyBalanceFetching())
    userAPI.getBalanceInfo(idProvider)
        .then(response => {
            dispatch(userSlice.actions.getMyBalanceFetchingSuccess(response.data as IBalance))
        })
        .catch(error => {
            dispatch(userSlice.actions.getMyBalanceFetchingError(error.message))
        })
}

export const getUserData = (idProvider?: string) => (dispatch: AppDispatch) => {
    dispatch(userSlice.actions.getUserDataFetching())
    userAPI.me()
        .then(response => {
            setTimeout(()=>{
                dispatch(userSlice.actions.getUserDataFetchingSuccess(response.data))
            }, 1000)
            getMyAccount(dispatch)
            getMyBalance(dispatch, idProvider)
        })
        .catch(error => {
            dispatch(userSlice.actions.getUserDataFetchingError(error.message))
        })
}
