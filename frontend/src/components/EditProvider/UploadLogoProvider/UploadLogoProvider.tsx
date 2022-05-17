import React, {FC, RefObject, useRef, useState} from 'react';
import classes from './UploadLogoProvider.module.scss'
import {Button} from "primereact/button";
import {ReactComponent as UploadSVG} from "../../../assets/svg/Download.svg";
import clsx from "clsx";
import {FileUpload, FileUploadHandlerParam, ItemTemplateOptions} from "primereact/fileupload";
import {withUploadFilesAPI} from "../../../api/api";

interface UploadLogoProviderProps {
    logo: {image_url: string, id: number | null},
    setLogo: (value: {image_url: string, id: number | null}) => void
}

const UploadLogoProvider: FC<UploadLogoProviderProps> = ({logo, setLogo}) => {
    const [fetchSendImg, setFetchSendImg] = useState(false)
    const uploadRef = useRef<FileUpload>(null)

    const uploadImage = async (file : File) => {
        let formData = new FormData();
        formData.append('image', file);
        withUploadFilesAPI.uploadImage(formData)
            .then(response => {
                setLogo({image_url: response.data.image_url, id: response.data.id})
                uploadRef.current?.clear()
            })
            .catch(error => {

            })
            .finally(()=>{
                setFetchSendImg(false)
            })
    }

    const uploadHandler = ({files} : FileUploadHandlerParam) => {
        const [file] = files;
        const fileReader = new FileReader()
        setFetchSendImg(true)
        fileReader.onload = (e) => {
            uploadImage(file);
        };
        fileReader.readAsDataURL(file);
    }

    return (
        <div className={classes.container}>
            <div className={classes.imgInner}>
                {logo?.image_url &&
                    <img src={logo?.image_url} alt="LogoProvider" className={classes.img}/>
                }
            </div>
            <FileUpload
                mode="basic"
                auto
                ref={uploadRef}
                multiple={false}
                name="demo"
                accept="image/*"
                customUpload={true}
                uploadHandler={uploadHandler}
                chooseOptions={{label: 'Загрузить файл', icon: (fetchSendImg ? "pi pi-spin pi-spinner" : <UploadSVG/>), className: clsx(classes.btn, "p-button-text")}}
            />
            {/*<Button
                className={clsx(classes.btn, "p-button-text")}
            >
                <UploadSVG/>
                <span>Загрузить файл</span>
            </Button>*/}
        </div>
    );
};

export default UploadLogoProvider;