import React, {FC, RefObject, useEffect, useState} from 'react';
import classes from './ModalWithdrawalMoney.module.scss'
import {Dialog} from "primereact/dialog";
import InputTextLS from "../../EditProvider/InputTextLS/InputTextLS";
import {Button} from "primereact/button";
import clsx from "clsx";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {balanceAPI, withUploadFilesAPI} from "../../../api/api";
import {userSlice} from "../../../redux/reducers/UserReducer/UserSlice";
import InputNumberLS from "../../EditProvider/InputNumberLS/InputNumberLS";
import {Toast} from "primereact/toast";

interface ModalWithdrawalMoneyProps {
    visible: boolean,
    onHide: () => void,
    toastRef?: RefObject<Toast>
}


const ModalWithdrawalMoney: FC<ModalWithdrawalMoneyProps> = ({visible, onHide, toastRef}) => {
    const [payee_name, setPayee_name] = useState<string>()
    const [checking_account, setChecking_account] = useState<string>()
    const [bank_BIC, setBank_BIC] = useState<string>()
    const [bank_name, setBank_name] = useState<string>()
    const [correspondent_account_number, setCorrespondent_account_number] = useState<string>()
    const [tax_number, setTax_number] = useState<string>()

    const [withdrawal, setWithdrawal] = useState<number | null>(null)

    const [fetchSave, setFetchSave] = useState(false)
    const [fetchCheck, setFetchCheck] = useState(false)

    const [commission, setCommission] = useState<number | null>(null)
    const [out, setOut] = useState<number | null>(null)

    const myBalance = useAppSelector(state => state.userReducer.myBalance)

    const dispatch = useAppDispatch()

    const save = () => {
        setFetchSave(true)
        let formData = new FormData();
        formData.append('billing_account', myBalance?.id ? `${myBalance?.id}` : "");
        formData.append('amount', withdrawal ? `${withdrawal}` : "0");
        formData.append('type', "WITHDRAW");
        formData.append('payee_name', `${payee_name}`);
        formData.append('checking_account', `${checking_account}`);
        formData.append('bank_BIC', `${bank_BIC}`);
        formData.append('bank_name', `${bank_name}`);
        formData.append('correspondent_account_number', `${correspondent_account_number}`);
        formData.append('tax_number', `${tax_number}`);
        withUploadFilesAPI.sendCheck(formData)
            .then(response => {
                setWithdrawal(null)
                setCommission(null)
                setOut(null)
                dispatch(userSlice.actions.updateMyBalance({balance: `${+(myBalance?.balance as string) - (withdrawal ?? 0)}`, freezed_amount: myBalance?.freezed_amount ? +myBalance?.freezed_amount + (withdrawal ?? 0) : (withdrawal ?? 0)}))
                toastRef?.current?.show({severity: 'success', summary: 'Запрос на вывод отправлен'})
            })
            .catch(error => {

            })
            .finally(()=>{
                setFetchSave(false)
            })
    }

    useEffect(()=>{
        if(myBalance?.id && withdrawal){
            setFetchCheck(true)
            balanceAPI.checkCommission(myBalance?.id, withdrawal)
                .then(response => {
                    setCommission(response.data.comission_amount)
                    setOut(response.data.amount_to_out)
                })
                .catch(error => {

                })
                .finally(()=>{
                    setFetchCheck(false)
                })
        }
    },[withdrawal])

    return (
        <Dialog
            header={"Вывод средств"}
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
                <div className={classes.balance}>
                    Доступно <span>{myBalance?.balance ?? 0}₽</span>
                </div>
                <div style={{width: 320, marginTop: 16}}>
                    <InputNumberLS min={0} max={myBalance?.balance ? +myBalance?.balance : 0} value={withdrawal} setValue={value => setWithdrawal(value)} label={"Сумма"} placeholder={"Введите сумму вывода"}/>
                    <div className={classes.comis}>Комиссия –
                        <span> {withdrawal ? (commission ?? 0).toFixed(2) : 0} ₽</span>
                    </div>
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
                        label={`Вывести ${out ? out : 0} ₽`}
                        loading={fetchSave}
                        disabled={out === null || out === 0 || fetchCheck}
                        onClick={save}
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalWithdrawalMoney;