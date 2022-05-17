import React, {FC, useState} from 'react';
import classes from "./SignUp.module.scss"
import { InputText } from 'primereact/inputtext';
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {useFormik} from "formik";
import * as yup from 'yup';
import clsx from "clsx";
import {userAPI} from "../../../api/api";
import {Captcha} from "primereact/captcha";
import {login} from "../../../redux/reducers/UserReducer/UserActionCreators";
import {useAppDispatch} from "../../../hooks/reduxHooks";

const SignUp: FC = () => {

    const dispatch = useAppDispatch()

    const [fetch, setFetch] = useState(false)
    const [success, setSuccess] = useState(false)

    const validation = yup.object({
        email: yup.string()
            .email("Некорректный Email")
            .required("Заполните поле"),
        name: yup.string()
            .required("Заполните поле"),
        password: yup.string()
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Пароль должен содержать 8 символов, один в верхнем регистре, один в нижнем регистре, одну цифру и один символ специального регистра"
            )
            .required("Заполните поле"),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Пароли не совпадают')
            .required("Заполните поле")
    })

    const formik = useFormik({
        initialValues:{
            email: "",
            name: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: validation,
        onSubmit: values => {
            setFetch(true)
            userAPI.SignUp(values.email, values.name, values.password)
                .then(response => {
                    dispatch(login(values.email, values.password, true))
                })
                .catch(error => {

                })
                .finally(()=>{
                    setFetch(false)
                })
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className={classes.inputInner}>
                <label className={classes.label} htmlFor="nameSignUp">Имя</label>
                <InputText
                    className={clsx(classes.input, (formik.touched.name && formik.errors.name) && "p-invalid block")}
                    id={"nameSignUp"}
                    name={"name"}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                    <div className={classes.inputError}>{formik.errors.name}</div>
                ) : null}
            </div>
            <div className={classes.inputInner}>
                <label className={classes.label} htmlFor="emailSignUp">Email</label>
                <InputText
                    className={clsx(classes.input, (formik.touched.email && formik.errors.email) && "p-invalid block")}
                    id={"emailSignUp"}
                    name={"email"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className={classes.inputError}>{formik.errors.email}</div>
                ) : null}
            </div>
            <div className={classes.inputInner}>
                <label className={classes.label} htmlFor="passwordSignUp">Пароль</label>
                <Password
                    className={clsx(classes.input, (formik.touched.password && formik.errors.password) && "p-invalid block")}
                    inputId={"passwordSignUp"}
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
            <div className={classes.inputInner}>
                <label className={classes.label} htmlFor="confirmPassword">Повторите пароль</label>
                <Password
                    className={clsx(classes.input, (formik.touched.confirmPassword && formik.errors.confirmPassword) && "p-invalid block")}
                    inputId={"confirmPassword"}
                    name={"confirmPassword"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    feedback={false}
                    toggleMask
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <div className={classes.inputError}>{formik.errors.confirmPassword}</div>
                ) : null}
            </div>
            <div className={classes.captchaInner}>
                <Captcha
                    siteKey="6LfC2U0fAAAAAJbspH-TnrxI_CW8oxQqcAEXFdAL"
                    onResponse={()=>{
                        setSuccess(true)
                    }}
                    onExpire={()=>{
                        setSuccess(false)
                    }}
                />
            </div>
            <div className={classes.btns}>
                <Button disabled={!success} label="Зарегистрироваться" className={classes.btn} loading={fetch} type={"submit"} iconPos="right"/>
            </div>
        </form>
    );
};

export default SignUp;
