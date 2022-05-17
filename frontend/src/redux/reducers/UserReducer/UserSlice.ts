import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../../../models/IUser";
import {IPlatform} from "../../../models/IPlatform";
import {IBalance} from "../../../models/IBalance";


interface UserState {
    errorsLogin: string
    isLoadingLogin: boolean
    isAuth: boolean
    confirmEmail: boolean
    isRemember: boolean
    isLoadingGetUserData: boolean
    errorsGetUserData: string
    userData: IUser | null
    currentAccount: {role: "user" | "platform", data: null | IPlatform}
    isLoadingGetMyProviders: boolean
    myProviders: IPlatform[]
    errorsGetMyProviders: string
    myBalance: IBalance | null,
    isLoadingGetMyBalance: boolean
    errorsGetMyBalance: string
    newProvider: boolean
}

const initialState: UserState = {
    errorsLogin: "",
    isLoadingLogin: false,
    isLoadingGetUserData: false,
    userData: null,
    errorsGetUserData: "",
    isAuth: false,
    confirmEmail: false,
    isRemember: false,
    currentAccount: {role: "user", data: null},
    isLoadingGetMyProviders: false,
    myProviders: [],
    errorsGetMyProviders: "",
    myBalance: null,
    isLoadingGetMyBalance: false,
    errorsGetMyBalance: "",
    newProvider: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginFetching(state){
            state.isLoadingLogin = true
        },
        loginFetchingSuccess(state){
            state.isLoadingLogin = false
            state.errorsLogin = ""
        },
        loginFetchingError(state, action: PayloadAction<string>){
            state.isLoadingLogin = false
            state.errorsLogin = action.payload
        },
        setIsRemember(state, action: PayloadAction<boolean>){
            state.isRemember = action.payload
        },
        getUserDataFetching(state){
            state.isLoadingGetUserData = true
        },
        getUserDataFetchingSuccess(state, action: PayloadAction<IUser>){
            state.isLoadingGetUserData = false
            state.userData = action.payload
            state.isAuth = true
            state.confirmEmail = action.payload.is_confirmed
            state.errorsGetUserData = ""
        },
        getUserDataFetchingError(state, action: PayloadAction<string>){
            state.isLoadingGetUserData = false
            state.errorsGetUserData = action.payload
        },
        getMyProvidersFetching(state){
            state.isLoadingGetMyProviders = true
        },
        getMyProvidersFetchingSuccess(state, action: PayloadAction<IPlatform[]>){
            state.isLoadingGetMyProviders = false
            state.errorsGetMyProviders = ""
            state.myProviders = action.payload
        },
        getMyProvidersFetchingError(state, action: PayloadAction<string>){
            state.isLoadingGetMyProviders = false
            state.errorsGetMyProviders = action.payload
        },
        getMyBalanceFetching(state){
            state.isLoadingGetMyBalance = true
        },
        getMyBalanceFetchingSuccess(state, action: PayloadAction<IBalance>){
            state.isLoadingGetMyBalance = false
            state.errorsGetMyBalance = ""
            state.myBalance = action.payload
        },
        updateMyBalance(state, action: PayloadAction<any>){
          state.myBalance = {...state.myBalance, ...action.payload}
        },
        upDateRequisites(state, action: PayloadAction<any>){
            state.myBalance = {...state.myBalance, ...action.payload}
        },
        getMyBalanceFetchingError(state, action: PayloadAction<string>){
            state.isLoadingGetMyBalance = false
            state.errorsGetMyBalance = action.payload
        },
        setCurrentAccount(state, action: PayloadAction<{role: "user" | "platform", data: null | IPlatform }>) {
            state.currentAccount = action.payload
        },
        editName(state, action: PayloadAction<string>){
            (state.userData as IUser).name = action.payload
        },
        setNewProvider(state, action: PayloadAction<boolean>){
            state.newProvider = action.payload
        },
        logout(){
            return initialState
        }
    }
})

export default userSlice.reducer;
