import React, {useEffect, useRef} from 'react';
import "../../assets/styles/tailwind-light-custom.css";
/*import "../../assets/styles/tailwind-light-batonis.css";*/
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import AuthMain from "../Auth/AuthMain";
import Catalog from "../Catalog/Catalog";
import PlatformPage from "../PlatformPage/PlatformPage";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import {userSlice} from "../../redux/reducers/UserReducer/UserSlice";
import {getUserData} from "../../redux/reducers/UserReducer/UserActionCreators";
import Basket from "../Basket/Basket";
import {Navigate} from "react-router-dom";
import Orders from "../Orders/Orders";
import OrderPage from "../OrderPage/OrderPage";
import Wallet from "../Wallet/Wallet";
import RedirectLoader from "../../components/RedirectLoader/RedirectLoader";
import OrderPagePlatform from "../OrderPagePlatform/OrderPagePlatform";
import Cabinet from "../Cabinet/Cabinet";
import UserInfo from "../../components/UserInfo/UserInfo";
import ProviderInfo from "../../components/ProviderInfo/ProviderInfo";
import NewProvider from "../../components/NewProvider/NewProvider";
import ConfirmSignUp from "../Auth/ConfirmSignUp/ConfirmSignUp";
import ConfirmEmailMiddleware from "../Auth/ConfirmEmailMiddleware/ConfirmEmailMiddleware";
import {useEffectOnce, useUpdateEffect} from "usehooks-ts";
import ResetPassword from "../Auth/ResetPassword/ResetPassword";
import CreatePassword from "../Auth/CreatePassword/CreatePassword";
import {Toast} from "primereact/toast";

function App() {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.userReducer.isAuth)
    const confirmEmail = useAppSelector(state => state.userReducer.confirmEmail)
    const isLoadingGetUserData = useAppSelector(state => state.userReducer.isLoadingGetUserData)
    const isRemember = useAppSelector(state => state.userReducer.isRemember)
    const currentAccount = useAppSelector(state => state.userReducer.currentAccount)

    const toastRefMain = useRef<Toast>(null)

    const navigate = useNavigate()

    useEffectOnce(()=>{
        dispatch(getUserData())
        return () => {
            if(localStorage.getItem("isRemember") === "false"){
                localStorage.clear()
            }
        }
    })

    useUpdateEffect(()=>{
        const idProvider = currentAccount.role === "platform" ? `${currentAccount?.data?.id}` : undefined
        dispatch(getUserData(idProvider))
        if(isAuth){
            navigate("/")
        }
        return () => {

        }
    }, [currentAccount])
    if(isLoadingGetUserData){
        return (
            <RedirectLoader/>
        )
    }
    return (
        <>
            <div className="App">
                {/*<PlatformPage/>*/}
                {!isAuth ?
                    <Routes>
                        <Route path={'/'} element={<AuthMain/>}/>
                        <Route path={'/confirm_email'} element={<ConfirmEmailMiddleware/>}/>
                        <Route path={'/request_reset_password'} element={<ResetPassword/>}/>
                        <Route path={'/reset_password'} element={<CreatePassword toastRef={toastRefMain}/>}/>
                        <Route path={"*"} element={<Navigate to={"/"} replace/>}/>
                    </Routes> :
                    <>
                        {!confirmEmail ?
                            <Routes>
                                <Route path={'/'} element={<ConfirmSignUp/>}/>
                                <Route path={'/confirm_email'} element={<ConfirmEmailMiddleware/>}/>
                            </Routes>:
                            <>
                                {currentAccount.role === "user" ?
                                    <Routes>
                                        <Route path={'/'} element={<Catalog/>}/>
                                        <Route path={'platform/:platformId'} element={<PlatformPage/>}/>
                                        <Route path={'basket'} element={<Basket/>}/>
                                        <Route path={'wallet'} element={<Wallet/>}/>
                                        <Route path={'orders'} element={<Orders/>}/>
                                        <Route path={'orders/:orderId'} element={<OrderPage/>}/>
                                        <Route path={'cabinet'} element={<Cabinet/>}>
                                            <Route index element={<UserInfo/>}/>
                                            <Route path={':platformId'} element={<ProviderInfo/>}/>
                                            <Route path={'new'} element={<NewProvider/>}/>
                                        </Route>
                                        <Route path={"*"} element={<Navigate to={"/"} replace/>}/>
                                    </Routes>:
                                    <Routes>
                                        <Route path={'/'} element={<Orders/>}/>
                                        <Route path={'wallet'} element={<Wallet/>}/>
                                        <Route path={'orders/:orderId'} element={<OrderPagePlatform/>}/>
                                        <Route path={'cabinet'} element={<Cabinet/>}>
                                            <Route index element={<UserInfo/>}/>
                                            <Route path={':platformId'} element={<ProviderInfo/>}/>
                                            <Route path={'new'} element={<NewProvider/>}/>
                                        </Route>
                                        <Route path={"*"} element={<Navigate to={"/"} replace/>}/>
                                    </Routes>
                                }
                            </>
                        }
                    </>
                }
            </div>
            <Toast ref={toastRefMain} position="bottom-right"/>
        </>
    );
}

export default App;
