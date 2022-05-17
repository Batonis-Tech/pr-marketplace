import React, {FC, RefObject, useState} from 'react';
import classes from './UserInfo.module.scss'
import {useAppSelector} from "../../hooks/reduxHooks";
import {Button} from "primereact/button";
import {ReactComponent as PenSVG} from "../../assets/svg/Pen.svg";
import clsx from "clsx";
import EditUser from "../EditUser/EditUser";
import {useOutletContext} from "react-router-dom";
import {Toast} from "primereact/toast";

const UserInfo: FC = () => {
    const user = useAppSelector(state => state.userReducer.userData)
    const [edit, setEdit] = useState<boolean>(false)
    const toastRef = useOutletContext<RefObject<Toast>>()
    if(edit){
        return <EditUser setEdit={setEdit} toastRef={toastRef}/>
    }
    return (
        <div className={classes.cols}>
            <div className={classes.data}>
                <div className={classes.dataItem}>
                    <div className={classes.dataItemTitle}>Имя</div>
                    <div className={classes.dataItemValue}>{user?.name}</div>
                </div>
                <div className={classes.dataItem}>
                    <div className={classes.dataItemTitle}>Email</div>
                    <div className={classes.dataItemValue}>{user?.email}</div>
                </div>
            </div>
            <div className={classes.sidebar}>
                <Button
                    className={clsx("p-button-text", classes.btnEdit)}
                    onClick={()=>setEdit(true)}
                >
                    <PenSVG/>
                    <span>Редактировать</span>
                </Button>
            </div>
        </div>
    );
};

export default UserInfo;