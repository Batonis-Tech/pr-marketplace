import React, {FC, useRef, useState} from 'react';
import classes from "./ConfirmSignUp.module.scss"
import * as yup from "yup";
import {useFormik} from "formik";
import {Button} from "primereact/button";
import clsx from "clsx";
import {ReactComponent as LeftArrow} from "../../../assets/svg/LeftArrow.svg";
import {InputText} from "primereact/inputtext";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {userSlice} from "../../../redux/reducers/UserReducer/UserSlice";
import {Toast} from "primereact/toast";
import {userAPI} from "../../../api/api";

const ConfirmSignUp: FC = () => {
    const [fetchReSendToken, setFetchReSendToken] = useState(false)

    const toastRef = useRef<Toast>(null)

    const user = useAppSelector(state => state.userReducer.userData)

    const dispatch = useAppDispatch()

    return (
        <>
            <div className={classes.main}>
                <div className={classes.container}>
                    <Button className={clsx("p-button-text", classes.btnBack)} onClick={()=>{dispatch(userSlice.actions.logout())}}>
                        <LeftArrow/>
                        <div style={{marginLeft: 8}}>Назад</div>
                    </Button>
                    <div className={classes.title}>Подтверждение регистрации</div>
                    <div className={classes.message}>Перейдите по ссылке в письме, отправленном на {user?.email} для подверждения вашего почтового адреса</div>
                    <Button
                        label="Отправить письмо еще раз"
                        className={clsx("p-button-text", classes.btnAgain)}
                        loading={fetchReSendToken}
                        iconPos="right"
                        onClick={()=>{
                            setFetchReSendToken(true)
                            userAPI.ReSendTokenSignUp(user?.email ?? "")
                                .then(response => {
                                    toastRef?.current?.show({severity: 'success', summary: 'Письмо отправлено'})
                                })
                                .catch(error => {

                                })
                                .finally(()=>{
                                    setFetchReSendToken(false)
                                })
                        }}
                    />
                </div>
            </div>
            <Toast ref={toastRef} position="bottom-right"/>
        </>

    );
};

export default ConfirmSignUp;
