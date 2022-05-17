import React, {FC, RefObject, useState} from 'react';
import classes from "../ModalQuillSolution/ModalQuillSolution.module.scss";
import {Editor} from "primereact/editor";
import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {basketAPI, ordersAPI} from "../../../api/api";

interface ModalQuillTaskForBasketProps{
    visible: boolean,
    onHide: () => void,
    value: any | null,
    readOnlyProp?: boolean,
    setValue?: (text: string) => void,
    toastRef?: RefObject<Toast>,
    updateProviders: (response: any) => void
}

const ModalQuillTaskForBasket: FC<ModalQuillTaskForBasketProps> = ({visible, updateProviders, onHide, value, setValue, toastRef, readOnlyProp = false}) => {
    const [objForServer, setObjForServer] = useState<any>()
    const [fetch, setFetch] = useState(false)

    const save = () => {
        setFetch(true)
        let tempOptions: any = []
        value?.options.map((opt: any) => {
            tempOptions.push(opt?.option?.id)
        })
        console.log(objForServer)
        console.log(JSON.stringify(objForServer))
        basketAPI.updateProductInBasket(value.id as number, {product: value.product.id, options: [...tempOptions], quill_task: JSON.stringify(objForServer)})
            .then(response => {
                updateProviders(response)
                toastRef?.current?.show({severity: 'success', summary: 'Текст задания сохранен'})
            })
            .catch(error => {
                toastRef?.current?.show({severity: 'error', summary: 'Текст задания не был сохранен', detail:'Ошибка на сервере, попробуйте позже'})
            })
            .finally(()=>{
                setFetch(false)
                onHide()
            })
    }

    return (
        <Dialog
            header={"Задание"}
            className={classes.modal}
            onHide={onHide}
            dismissableMask
            draggable={false}
            visible={visible}
            style={{ width: 640 }}
        >
            <div className={classes.content}>
                <Editor readOnly={readOnlyProp} style={{height:'320px'}} value={value !== null ? value?.quill_task : ""} onTextChange={(e) => {
                        setObjForServer({html: e.htmlValue, delta: e.source})
                }} />
                <Button loading={fetch} className={classes.btn} label={"Сохранить"} onClick={save}/>
            </div>
        </Dialog>
    );
};

export default ModalQuillTaskForBasket;