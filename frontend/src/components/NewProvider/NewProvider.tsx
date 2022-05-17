import React, {FC, RefObject, useState} from 'react';
import classes from './NewProvider.module.scss'
import {Button} from "primereact/button";
import clsx from "clsx";
import {ReactComponent as PenSVG} from "../../assets/svg/Pen.svg";
import {useOutletContext} from "react-router-dom";
import {Toast} from "primereact/toast";
import EditProvider from "../EditProvider/EditProvider";

const NewProvider: FC = () => {
    const [edit, setEdit] = useState<boolean>(false)
    const toastRef = useOutletContext<RefObject<Toast>>()

    if(edit){
        return <EditProvider setEdit={setEdit} toastRef={toastRef}/>
    }

    return (
        <div className={classes.cols}>
            <div className={classes.data}>
                <div className={classes.title}>Новая площадка</div>
            </div>
            <div className={classes.sidebar}>
                <Button
                    className={clsx("p-button-text", classes.btnEdit)}
                    onClick={()=>{setEdit(true)}}
                >
                    <PenSVG/>
                    <span>Редактировать</span>
                </Button>
            </div>
        </div>
    );
};

export default NewProvider;