import React, {FC, RefObject, useState} from 'react';
import classes from './ModalQuillSolution.module.scss'
import {ReactComponent as CharmInfo} from "../../../assets/svg/CharmInfo.svg";
import {Button} from "primereact/button";
import clsx from "clsx";
import {ReactComponent as Download} from "../../../assets/svg/Download.svg";
import {Dialog} from "primereact/dialog";
import {Editor} from "primereact/editor";
import {ordersAPI} from "../../../api/api";
import {Toast} from "primereact/toast";

interface ModalQuillSolutionProps{
    visible: boolean,
    onHide: () => void,
    value: string,
    orderId?: string,
    readOnlyProp?: boolean,
    setValue?: (text: string) => void,
    showSave?: boolean,
    toastRef?: RefObject<Toast>,
    refreshOrder?: () => void
}

const ModalQuillSolution: FC<ModalQuillSolutionProps> = ({visible, refreshOrder, toastRef, onHide, value, setValue, orderId, readOnlyProp = false, showSave}) => {
    const [objForServer, setObjForServer] = useState<any>()
    const [fetch, setFetch] = useState(false)

    const save = () => {
        setFetch(true)
        ordersAPI.updateQuillSolutionPlatform(orderId, JSON.stringify(objForServer))
            .then(response => {
                toastRef?.current?.show({severity: 'success', summary: 'Текст публикации сохранен'})
            })
            .catch(error => {
                toastRef?.current?.show({severity: 'error', summary: 'Текст публикации не был сохранен', detail:'Ошибка на сервере, попробуйте позже'})
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
            header={"Текст публикации"}
            className={classes.modal}
            onHide={onHide}
            dismissableMask
            draggable={false}
            visible={visible}
            style={{ width: 640 }}
        >
            <div className={classes.content}>
                <Editor readOnly={readOnlyProp} style={{height:'320px'}} value={value} onTextChange={(e) => {
                    if(setValue){
                        setObjForServer({html: e.htmlValue, delta: e.source})
                        setValue(e.htmlValue as string)
                    }
                }} />
                {showSave &&
                    <Button loading={fetch} className={classes.btn} label={"Сохранить"} onClick={save}/>
                }
            </div>
        </Dialog>
    );
};

export default ModalQuillSolution;