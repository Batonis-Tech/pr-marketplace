import React, {FC, RefObject, useState} from 'react';
import classes from './ModalAddURLPub.module.scss'
import {Dialog} from "primereact/dialog";
import clsx from "clsx";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ordersAPI} from "../../../api/api";
import {Toast} from "primereact/toast";

interface ModalAddUrlPubProps {
    visible: boolean,
    onHide: () => void,
    value: string,
    orderId?: string,
    setValue?: (text: string) => void,
    toastRef?: RefObject<Toast>,
    refreshOrder?: () => void
}

const ModalAddUrlPub: FC<ModalAddUrlPubProps> = ({visible, refreshOrder, onHide, value, setValue, orderId, toastRef}) => {
    const [fetch, setFetch] = useState(false)

    const save = () => {
        setFetch(true)
        ordersAPI.updatePubURLPlatform(orderId, value)
            .then(response => {
                toastRef?.current?.show({severity: 'success', summary: 'Ссылка была прикреплена'})
            })
            .catch(error => {
                if(error?.response?.data?.publication_url[0]){
                    toastRef?.current?.show({severity: 'error', summary: 'Ссылка не была прикреплена', detail:'Введите корректную ссылку'})
                }else {
                    toastRef?.current?.show({severity: 'error', summary: 'Ссылка не была прикреплена', detail:'Ошибка на сервере, попробуйте позже'})
                }
            })
            .finally(()=>{
                setFetch(false)
                if(refreshOrder){
                    refreshOrder()
                    onHide()
                }
            })
    }

    return (
        <Dialog
            header={"Публикация"}
            className={classes.modal}
            onHide={onHide}
            dismissableMask
            draggable={false}
            visible={visible}
            style={{ width: 640 }}
        >
            <div className={classes.content}>
                <div className={classes.inputInner}>
                    <label className={classes.label} htmlFor="Link">Ссылка на публикацию</label>
                    <InputText
                        className={clsx(classes.input)}
                        id={"Link"}
                        name={"Link"}
                        value={value}
                        onChange={(e) => {
                            if(setValue){
                                setValue(e.target.value)
                            }
                        }}
                        placeholder={"Укажите прямую ссылку на публикацию"}
                    />
                </div>
                <Button loading={fetch} className={classes.btn} label={"Сохранить"} disabled={value === null} onClick={save}/>
            </div>
        </Dialog>
    );
};

export default ModalAddUrlPub;