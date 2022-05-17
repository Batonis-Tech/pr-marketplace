import React, {FC, RefObject, useState} from 'react';
import classes from "../ModalQuillSolution/ModalQuillSolution.module.scss";
import {Dialog} from "primereact/dialog";
import {Editor} from "primereact/editor";
import {Toast} from "primereact/toast";

interface ModalQuillTaskProps{
    visible: boolean,
    onHide: () => void,
    value: string,
    readOnlyProp?: boolean,
    orderId?: string,
    setValue?: (text: string) => void,
    toastRef?: RefObject<Toast>
}

const ModalQuillTask: FC<ModalQuillTaskProps> = ({visible, onHide, value, setValue, readOnlyProp = false}) => {
    const [objForServer, setObjForServer] = useState<any>()
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
                <Editor readOnly={readOnlyProp} style={{height:'320px'}} value={value} onTextChange={(e) => {
                    if(setValue){
                        setObjForServer({html: e.htmlValue, delta: e.source})
                        setValue(e.htmlValue as string)
                    }
                }} />
            </div>
        </Dialog>
    );
};

export default ModalQuillTask;