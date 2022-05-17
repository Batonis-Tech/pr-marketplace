import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {IUser} from "../models/IUser";
import {ITokenResponse} from "../models/ITokenResponse";
import {IBasketItemForLS} from "../models/IBasketItem";
import {store} from "../index";
import {userSlice} from "../redux/reducers/UserReducer/UserSlice";

const backendURL = process.env.REACT_APP_DEV_BACKEND_URL
const backendURLAuth = process.env.REACT_APP_DEV_BACKEND_URL_AUTH

const instance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: backendURL,
});

const instanceWithToken: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: backendURL
});

const instanceWithOAuth: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: backendURLAuth,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

const instanceWithTokenFile = axios.create({
    withCredentials: true,
    baseURL: backendURL,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

instanceWithTokenFile.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.headers === undefined) {
        config.headers = {};
    }
    config.headers.Authorization = "Bearer " + localStorage.getItem("token")
    return config
})

instanceWithTokenFile.interceptors.response.use(
    (config: AxiosResponse) => {
        return config
    },
    async (error) => {
        const originalRequest = error.config
        if(error.response.status === 401 && error.config && !error._isRetry){
            originalRequest._isRetry = true
            try {
                const response = await oAuthAPI.refresh()
                localStorage.setItem('token', response.data.access_token)
                localStorage.setItem('tokenRefresh', response.data.refresh_token)
                return instanceWithTokenFile.request(originalRequest)
            }
            catch (e){
                localStorage.clear()
                store.dispatch(userSlice.actions.logout())
            }
        }
        throw error
    }
)

instanceWithToken.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.headers === undefined) {
        config.headers = {};
    }
    config.headers.Authorization = "Bearer " + localStorage.getItem("token")
    return config
})

instanceWithToken.interceptors.response.use(
    (config: AxiosResponse) => {
        return config
    },
    async (error) => {
        const originalRequest = error.config
        if(error.response.status === 401 && error.config && !error._isRetry){
            originalRequest._isRetry = true
            try {
                const response = await oAuthAPI.refresh()
                localStorage.setItem('token', response.data.access_token)
                localStorage.setItem('tokenRefresh', response.data.refresh_token)
                return instanceWithToken.request(originalRequest)
            }
            catch (e){
                localStorage.clear()
                store.dispatch(userSlice.actions.logout())
            }
        }
        throw error
    }
)


export const oAuthAPI = {
    refresh(){
        let params = new URLSearchParams()
        params.append('grant_type', 'refresh_token')
        params.append('client_id', process.env.REACT_APP_CLIENT_ID as string)
        params.append('client_secret', process.env.REACT_APP_CLIENT_SECRET as string)
        params.append('refresh_token', `${ localStorage.getItem("tokenRefresh")}`)
        return instanceWithOAuth.post(`o/token/`, params)
    },
    login(email: string, password: string){
        let params = new URLSearchParams()
        params.append('grant_type', 'password')
        params.append('client_id', process.env.REACT_APP_CLIENT_ID as string)
        params.append('client_secret', process.env.REACT_APP_CLIENT_SECRET as string)
        params.append('username', email)
        params.append('password', password)
        return instanceWithOAuth.post<ITokenResponse>(`o/token/`, params)
    },
    convert_token(id_token: string){
        let params = new URLSearchParams()
        params.append('grant_type', 'convert_token')
        params.append('client_id', process.env.REACT_APP_CLIENT_ID as string)
        params.append('client_secret', process.env.REACT_APP_CLIENT_SECRET as string)
        params.append('backend', 'apple-id-mobile')
        params.append('token', id_token)
        return instanceWithOAuth.post('o/convert-token/', params)
    },
}

export const withUploadFilesAPI = {
    uploadImage(formData: FormData){
        return instanceWithTokenFile.post(`/images/upload?compress=False`, formData)
    },
    sendCheck(formData: FormData){
        return instanceWithTokenFile.post(`/billing/create_request`, formData)
    }
}

export const userAPI = {
    me(){
        return  instanceWithToken.get(`/users/me`);
    },
    getAccounts(){
        return  instanceWithToken.get(`/providers/my`)
    },
    getBalanceInfo(idProvider?: string){
        return instanceWithToken.get(`/billing/account/my?${idProvider ? `provider_id=${idProvider}` : ""}`)
    },
    SignUp(email: string, name: string, password: string){
        return instance.post(`/users/auth/sign_up/me/`, {email, name, password})
    },
    ReSendTokenSignUp(email: string){
        return instanceWithToken.post(`/users/auth/sign_up/confirm_email/`, {email})
    },
    ConfirmTokenSignUp(token: string){
        return instanceWithToken.get(`/users/auth/sign_up/confirm_email/${token}`)
    },
    Captcha(token: string){
        return instance.post(`/captcha`, {["g-recaptcha-response"]: token})
    },
    ResetPassword(email: string){
        return instance.post(`/users/auth/reset_password`, {email})
    },
    ConfirmTokenResetPassword(token: string, password: string){
        return instance.post(`/users/auth/reset_password/${token}`, {password})
    }
}

export const catalogAPI = {
    getPlatforms(query: string | null){
        return instanceWithToken.get(`/providers/${query !== null ? `?${query}`: ""}`)
    }
}

export const basketAPI = {
    getBasket(params: string){
        return instanceWithToken.get(`/products/cart/items${params.length > 0 ? "?" : ""}${params}`)
    },
    addProductInBasket(item: IBasketItemForLS){
        return instanceWithToken.post(`/products/cart/items/create`, {...item})
    },
    updateProductInBasket(itemId: number, item: IBasketItemForLS){
        return instanceWithToken.patch(`/products/cart/items/${itemId}`, {...item})
    },
    actionForSelectProductsInBasket(items: number[], action: "delete" | "info" | "order"){
        return instanceWithToken.post(`/products/cart/items/action?action=${action}`, {items})
    }
}

export const ordersAPI = {
    getOrders(params: string, idProvider?: string, userId?: string){
        return instanceWithToken.get(`/products/orders/?${params}${params.length > 0 ? "&" : ""}${idProvider ? `provider=${idProvider}` : ""}${userId ? `user=${userId}` : ""}`)
    },
    getOrder(idOrder?: number | string, idProvider?: number){
        return instanceWithToken.get(`/products/orders/${idOrder}?${idProvider ? `provider_id=${idProvider}` : ""}`)
    },
    setActionOrderUser(order_id?: number | string, action?: string){
        return instanceWithToken.get(`/products/orders/${order_id}/owner_action?action=${action}`)
    },
    setActionOrderPlatform(order_id?: number | string, action?: string){
        return instanceWithToken.get(`/products/orders/${order_id}/executor_action?action=${action}`)
    },
    updateQuillSolutionPlatform(order_id?: number | string, data?: any){
        return instanceWithToken.patch(`/products/orders/${order_id}/executor_update`, {quill_solution: data})
    },
    updatePubURLPlatform(order_id?: number | string, data?: string){
        return instanceWithToken.patch(`/products/orders/${order_id}/executor_update`, {publication_url: data})
    }
}

export const balanceAPI = {
    getTransactions(query?: string | null){
        return instanceWithToken.get(`/billing/transactions${query !== null ? `?${query}`: ""}`)
    },
    editRequisites(account_id: number | string, data: any){
        return instanceWithToken.patch(`/billing/account/${account_id}/edit`, {...data})
    },
    checkCommission(billing_account: number | string, amount: number){
        return instanceWithToken.post(`/billing/check_request`, {billing_account, amount})
    }
}

export const cabinetAPI = {
    editUser(userId: string | number, name: string){
        return instanceWithToken.patch(`/users/${userId}/edit`, {name})
    },
    editProvider(providerId: number | string, data: any){
        return instanceWithToken.patch(`/providers/${providerId}/edit`, {...data})
    },
    createProvider(data: any){
        return instanceWithToken.post(`/providers/create`, {...data})
    }
}
