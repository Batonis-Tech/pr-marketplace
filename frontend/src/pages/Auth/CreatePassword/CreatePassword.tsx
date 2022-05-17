import React, {FC, RefObject, useRef, useState} from 'react';
import classes from "./CreatePassword.module.scss";
import * as yup from "yup";
import {useFormik} from "formik";
import {Button} from "primereact/button";
import clsx from "clsx";
import {ReactComponent as LeftArrow} from "../../../assets/svg/LeftArrow.svg";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";
import {userAPI} from "../../../api/api";
import {useNavigate, useSearchParams} from "react-router-dom";

interface CreatePasswordProps {
    toastRef?: RefObject<Toast>
}


const CreatePassword: FC<CreatePasswordProps> = ({toastRef}) => {
    const [fetchCreate, setFetchCreate] = useState(false)

    const [searchParas, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    const validation = yup.object({
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
            password: "",
            confirmPassword: ""
        },
        validationSchema: validation,
        onSubmit: values => {
            setFetchCreate(true)
            userAPI.ConfirmTokenResetPassword(searchParas.get("token") ?? "", values.password)
                .then(response => {
                    toastRef?.current?.show({severity: 'success', summary: 'Успешно'})
                    navigate('/')
                })
                .catch(error => {
                    toastRef?.current?.show({severity: 'error', summary: 'Что-то пошло не так'})
                })
                .finally(()=>{
                    setFetchCreate(false)
                })
        }
    })

    return (
        <>
            <div className={classes.main}>
                <div className={classes.container}>
                    {/*<Button className={clsx("p-button-text", classes.btnBack)} onClick={()=>{}}>
                        <LeftArrow/>
                        <div style={{marginLeft: 8}}>Назад</div>
                    </Button>*/}
                    <div className={classes.title}>Создание пароля</div>
                    <form onSubmit={formik.handleSubmit} className={classes.from}>
                        <div className={classes.inputInner}>
                            <label className={classes.label} htmlFor="passwordCreatePassword">Новый пароль</label>
                            <Password
                                className={clsx(classes.input, (formik.touched.password && formik.errors.password) && "p-invalid block")}
                                inputId={"passwordCreatePassword"}
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
                            <label className={classes.label} htmlFor="confirmPasswordCreatePassword">Повторите пароль</label>
                            <Password
                                className={clsx(classes.input, (formik.touched.confirmPassword && formik.errors.confirmPassword) && "p-invalid block")}
                                inputId={"confirmPasswordCreatePassword"}
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
                        <Button label="Сохранить" className={classes.btn} loading={fetchCreate} type={"submit"} iconPos="right"/>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreatePassword;
