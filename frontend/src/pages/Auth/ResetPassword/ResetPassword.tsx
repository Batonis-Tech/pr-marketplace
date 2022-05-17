import React, {FC, useRef, useState} from 'react';
import classes from "./ResetPassword.module.scss";
import {ReactComponent as LeftArrow} from "../../../assets/svg/LeftArrow.svg";
import {Button} from "primereact/button";
import clsx from "clsx";
import {InputText} from "primereact/inputtext";
import {useFormik} from "formik";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {userAPI} from "../../../api/api";
import {Toast} from "primereact/toast";

const ResetPassword: FC = () => {

    const [fetchReset, setFetchReset] = useState(false)

    const navigate = useNavigate()
    const toastRef = useRef<Toast>(null)

    const validation = yup.object({
        email: yup.string()
            .email("Некорректный Email")
            .required("Заполните поле")
    })

    const formik = useFormik({
        initialValues:{
            email: "",
        },
        validationSchema: validation,
        onSubmit: values => {
            setFetchReset(true)
            userAPI.ResetPassword(values.email)
                .then(response => {
                    toastRef?.current?.show({severity: 'success', summary: 'Письмо отправлено'})
                })
                .catch(error => {
                    if(error.response.status === 400){
                        toastRef?.current?.show({severity: 'error', summary: 'Нет аккаунта с данным email'})
                    }
                })
                .finally(()=>{
                    setFetchReset(false)
                })
        }
    })

    return (
        <>
            <div className={classes.main}>
                <div className={classes.container}>
                    <Button className={clsx("p-button-text", classes.btnBack)} onClick={()=>{navigate('/')}}>
                        <LeftArrow/>
                        <div style={{marginLeft: 8}}>Назад</div>
                    </Button>
                    <div className={classes.title}>Восстановление пароля</div>
                    <div className={classes.message}>Отправим письмо для сброса пароля на email, использованный при регистрации</div>
                    <form onSubmit={formik.handleSubmit} className={classes.from}>
                        <div className={classes.inputInner}>
                            <label className={classes.label} htmlFor="emailResetPassword">Email</label>
                            <InputText
                                className={clsx(classes.input, (formik.touched.email && formik.errors.email) && "p-invalid block")}
                                id={"emailResetPassword"}
                                name={"email"}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className={classes.inputError}>{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <Button
                            label="Отправить"
                            className={classes.btn}
                            loading={fetchReset}
                            type={"submit"}
                            iconPos="right"
                        />
                    </form>
                </div>
            </div>
            <Toast ref={toastRef} position="bottom-right"/>
        </>
    );
};

export default ResetPassword;
