import React, {FC, RefObject, useRef, useState} from 'react';
import classes from "./ModalRequisites.module.scss";
import {ReactComponent as CharmInfo} from "../../../assets/svg/CharmInfo.svg";
import {ReactComponent as UploadSVG, ReactComponent as Download} from "../../../assets/svg/Download.svg";
import {ReactComponent as DocumentVoid} from "../../../assets/svg/DocumentVoid.svg";
import {ReactComponent as Trash} from "../../../assets/svg/Trash.svg";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import QR from "../../../assets/images/QR.png"
import clsx from "clsx";
import InputNumberLS from "../../EditProvider/InputNumberLS/InputNumberLS";
import {FileUpload, FileUploadHandlerParam} from "primereact/fileupload";
import {withUploadFilesAPI} from "../../../api/api";
import {useAppSelector} from "../../../hooks/reduxHooks";
import {Toast} from "primereact/toast";

interface ModalRequisitesProps{
    visible: boolean,
    onHide: () => void,
    toastRef?: RefObject<Toast>
}

interface FileUploadCustom extends FileUpload {
    files: File[],
}

const ModalRequisites: FC<ModalRequisitesProps> = ({visible, onHide, toastRef}) => {
    const [sum, setSum] = useState<number | null>(null)
    const [fetchSendImg, setFetchSendImg] = useState(false)
    const uploadRef = useRef<FileUploadCustom>(null)
    const [isRequired, setIsRequired] = useState(false)
    const [errorUpload, setErrorUpload] = useState(false)

    const myBalance = useAppSelector(state => state.userReducer.myBalance)

    const uploadImage = async (file : File) => {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('billing_account', myBalance?.id ? `${myBalance?.id}` : "");
        formData.append('amount', sum ? `${sum}` : "0");
        formData.append('type', "RECIEVE");
        withUploadFilesAPI.sendCheck(formData)
            .then(response => {
                uploadRef.current?.clear()
                setSum(null)
                toastRef?.current?.show({severity: 'success', summary: 'Чек отправлен'})
            })
            .catch(error => {

            })
            .finally(()=>{
                setFetchSendImg(false)
            })
    }

    const uploadHandler = ({files} : FileUploadHandlerParam) => {
        if(sum !== 0 && sum !== null){
            if(files?.length !== 0){
                const [file] = files;
                const fileReader = new FileReader()
                setFetchSendImg(true)
                fileReader.onload = (e) => {
                    uploadImage(file);
                };
                fileReader.readAsDataURL(file);
            }else{
                setErrorUpload(true)
            }
        }else{
            setIsRequired(true)
        }
    }

    return (
        <Dialog
            header={"Реквизиты"}
            className={classes.modal}
            onHide={onHide}
            dismissableMask
            draggable={false}
            visible={visible}
            style={{ width: 640 }}
        >
            <div className={classes.content}>
                <div className={classes.charmInner}>
                    <CharmInfo/>
                    <div className={classes.charmText}>Для пополнения баланса на любую сумму совершите платеж по указанным реквизитам. Автоматически заполнить платеж можно, отсканировав QR-код в приложении банка. После совершения операции обязательно загрузите чек.</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.infoName}>Наименование</div>
                    <div className={classes.infoValue}>АО «БизнесАктив»</div>
                    <div className={classes.infoName}>ИНН</div>
                    <div className={classes.infoValue}>7728184325</div>
                    <div className={classes.infoName}>Наименование банка</div>
                    <div className={classes.infoValue}>АО «АЛЬФА-БАНК»</div>
                    <div className={classes.infoName}>БИК банка</div>
                    <div className={classes.infoValue}>044525593</div>
                    <div className={classes.infoName}>Корр. счет</div>
                    <div className={classes.infoValue}>30101810200000000663</div>
                    <div className={classes.infoName}>Расчетный счет</div>
                    <div className={classes.infoValue}>40702810524660003559</div>
                </div>
                <img src={QR} className={classes.qrCode} alt={"QR code"}/>
                <div style={{width: 320, marginBottom: 50}}>
                    <InputNumberLS required isRequired={isRequired} setIsRequired={setIsRequired} value={sum} setValue={value => setSum(value)} label={"Сумма"} placeholder={"Введите сумму ввода"}/>
                </div>
                <FileUpload
                    ref={uploadRef}
                    name="demo"
                    accept="image/*"
                    customUpload={true}
                    uploadHandler={uploadHandler}
                    onSelect={(e)=>{
                        if(uploadRef.current && uploadRef?.current?.files?.length >= 2) uploadRef?.current?.files.shift()
                        setErrorUpload(false)
                    }}
                    chooseOptions={{label: 'Загрузить чек', icon: (<UploadSVG/>), className: clsx(classes.btn, "p-button-text")}}
                    uploadOptions={{label: 'Отправить', icon: (fetchSendImg ? "pi pi-spin pi-spinner" : ""), className: clsx(classes.btn, classes.btnUpload)}}
                    cancelOptions={{label: 'Отменить', icon: (fetchSendImg ? "pi pi-spin pi-spinner" : ""), className: clsx(classes.btn, classes.btnCancel)}}
                />
                {errorUpload && <span className={classes.error}>Загрузите чек</span>}
                <div className={classes.btns}>
                    <Button
                        className={clsx(classes.closeBtn, "p-button-text")}
                        onClick={()=> {
                            if (uploadRef.current) {
                                uploadRef.current.clear()
                            }
                            onHide()
                        }}
                    >
                        <span>Отменить</span>
                    </Button>
                    <Button
                        className={clsx(classes.sendBtn)}
                        loading={fetchSendImg}
                        onClick={()=> {
                            if (uploadRef.current) {
                                uploadRef.current.upload()
                            }
                        }}
                    >
                        <span>Отправить</span>
                    </Button>
                </div>

            </div>

        </Dialog>
    );
};

export default ModalRequisites;