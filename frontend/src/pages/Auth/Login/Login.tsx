import React, {FC, useState} from 'react';
import classes from "./Login.module.scss"
import {InputText} from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import clsx from "clsx";
import {useFormik} from "formik";
import * as yup from 'yup';
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {login} from "../../../redux/reducers/UserReducer/UserActionCreators";
import {useNavigate} from "react-router-dom";

const Login: FC = () => {
    const isLoading = useAppSelector(state => state.userReducer.isLoadingLogin)
    const error = useAppSelector(state => state.userReducer.errorsLogin)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const validation = yup.object({
        email: yup.string()
            .email("Некорректный Email")
            .required("Заполните поле"),
        password: yup.string()
            /*.matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
            )*/
            .required("Заполните поле")
    })

    const formik = useFormik({
        initialValues:{
            email: "",
            password: "",
            remember: true
        },
        validationSchema: validation,
        onSubmit: values => {
            dispatch(login(values.email, values.password, values.remember))
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={classes.inputInner}>
                <label className={classes.label} htmlFor="emailLogin">Email</label>
                <InputText
                    className={clsx(classes.input, (formik.touched.email && formik.errors.email) && "p-invalid block")}
                    id={"emailLogin"}
                    name={"email"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className={classes.inputError}>{formik.errors.email}</div>
                ) : null}
            </div>
            <div className={classes.inputInner}>
                <label className={classes.label} htmlFor="passwordLogin">Пароль</label>
                <Password
                    className={clsx(classes.input, (formik.touched.password && formik.errors.password) && "p-invalid block")}
                    inputId={"passwordLogin"}
                    name={"password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    feedback={false}
                    toggleMask
                />
                {formik.touched.password && formik.errors.password ? (
                    <div className={classes.inputError}>{formik.errors.password}</div>
                ) : null}
            </div>
            <div className={classes.btns}>
                <Button label="Забыли пароль?" type={"button"} className={clsx("p-button-text", classes.btn)} onClick={()=>navigate("/request_reset_password")} />
                <Button label="Войти" className={classes.btn} loading={isLoading} type={"submit"} iconPos="right"/>
            </div>
            {error ? (
                <div className={classes.inputError} style={{marginTop: -12, marginBottom: 4}}>{error}</div>
            ) : null}
            <div className={classes.checkboxInner}>
                <Checkbox inputId="remember" name={"remember"} checked={formik.values.remember} onChange={formik.handleChange} className={classes.checkbox} />
                <label htmlFor="remember" className={classes.checkboxLabel}>Запомнить меня</label>
            </div>
        </form>
    );
};

export default Login;
