import React, {FC, useEffect, useState} from 'react';
import classes from "./ModalEditRequisites.module.scss"
import {Dialog} from "primereact/dialog";
import InputTextLS from "../../EditProvider/InputTextLS/InputTextLS";
import {Button} from "primereact/button";
import clsx from "clsx";
import {balanceAPI} from "../../../api/api";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {userSlice} from "../../../redux/reducers/UserReducer/UserSlice";

interface ModalEditRequisitesProps {
    visible: boolean,
    onHide: () => void,
    accountId: number | string
}

const ModalEditRequisites: FC<ModalEditRequisitesProps> = ({visible, onHide, accountId}) => {
    const [payee_name, setPayee_name] = useState<string>()
    const [checking_account, setChecking_account] = useState<string>()
    const [bank_BIC, setBank_BIC] = useState<string>()
    const [bank_name, setBank_name] = useState<string>()
    const [correspondent_account_number, setCorrespondent_account_number] = useState<string>()
    const [tax_number, setTax_number] = useState<string>()

    const [fetchSave, setFetchSave] = useState(false)

    const myBalance = useAppSelector(state => state.userReducer.myBalance)

    const dispatch = useAppDispatch()

    const save = () => {
        setFetchSave(true)
        let tempRequisites: any = {}
        tempRequisites["payee_name"] = payee_name
        tempRequisites["checking_account"] = checking_account
        tempRequisites["bank_BIC"] = bank_BIC
        tempRequisites["bank_name"] = bank_name
        tempRequisites["correspondent_account_number"] = correspondent_account_number
        tempRequisites["tax_number"] = tax_number
        balanceAPI.editRequisites(accountId, tempRequisites)
            .then(response => {
                dispatch(userSlice.actions.upDateRequisites(response.data))
                onHide()
            })
            .catch(error => {

            })
            .finally(()=>{
                setFetchSave(false)
            })
    }

    return (
        <Dialog
            header={"Реквизиты"}
            className={classes.modal}
            onHide={onHide}
            onShow={()=>{
                setPayee_name(myBalance?.payee_name ?? "")
                setChecking_account(myBalance?.checking_account ?? "")
                setBank_BIC(myBalance?.bank_BIC ?? "")
                setBank_name(myBalance?.bank_name ?? "")
                setCorrespondent_account_number(myBalance?.correspondent_account_number ?? "")
                setTax_number(myBalance?.tax_number ?? "")
            }}
            dismissableMask
            draggable={false}
            visible={visible}
            style={{ width: 640 }}
        >
            <div className={classes.content}>
                <div className={classes.grid}>
                    <InputTextLS value={payee_name} setValue={value => setPayee_name(value)} label={"Наименование"} placeholder={"Введите наименование"}/>
                    <InputTextLS value={tax_number} setValue={value => setTax_number(value)} label={"ИНН"} placeholder={"Введите ИНН"}/>
                    <InputTextLS value={bank_name} setValue={value => setBank_name(value)} label={"Наименование банка"} placeholder={"Введите наименование банка"}/>
                    <InputTextLS value={bank_BIC} setValue={value => setBank_BIC(value)} label={"БИК банка"} placeholder={"Введите БИК банка"}/>
                    <InputTextLS value={correspondent_account_number} setValue={value => setCorrespondent_account_number(value)} label={"Корр. счет"} placeholder={"Введите Корр. счет"}/>
                    <InputTextLS value={checking_account} setValue={value => setChecking_account(value)} label={"Номер счета"} placeholder={"Введите номер счета"}/>
                </div>
                <div className={classes.btns}>
                    <Button
                        className={clsx("p-button-text", classes.btn)}
                        label={"Отменить"}
                        disabled={fetchSave}
                        onClick={onHide}
                    />
                    <Button
                        className={classes.btn}
                        label={"Сохранить"}
                        loading={fetchSave}
                        onClick={save}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalEditRequisites;