import React, {FC, RefObject, useState} from 'react';
import classes from './EditUser.module.scss'
import {useAppSelector} from "../../hooks/reduxHooks";
import {cabinetAPI} from "../../api/api";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import clsx from "clsx";
import {Toast} from "primereact/toast";
import {useDispatch} from "react-redux";
import {userSlice} from "../../redux/reducers/UserReducer/UserSlice";

interface EditUserProps {
    setEdit: (value: boolean) => void,
    toastRef?: RefObject<Toast>
}

const EditUser: FC<EditUserProps> = ({setEdit, toastRef}) => {
    const user = useAppSelector(state => state.userReducer.userData)
    const dispatch = useDispatch()
    const [name, setName] = useState<string>(user?.name ?? "")
    const [fetchSave, setFetchSave] = useState<boolean>(false)

    const save = () => {
        setFetchSave(true)
        cabinetAPI.editUser(user?.id as number, name)
            .then(response => {
                toastRef?.current?.show({severity: 'success', summary: 'Информация была сохранена'})
                dispatch(userSlice.actions.editName(name))
                setEdit(false)
            })
            .catch(error => {
                toastRef?.current?.show({severity: 'error', summary: 'Информация не была сохранена'})
            })
            .finally(()=>{
                setFetchSave(false)
            })
    }

    return (
        <div className={classes.content}>
            <div>
                <div className={classes.inputInner}>
                    <label htmlFor="name" className={classes.inputLabel}>Имя</label>
                    <InputText
                        id={"name"}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={"Введите новое имя"}
                        className={classes.input}
                    />
                </div>
            </div>
            <div className={classes.bottomBar}>
                <Button
                    className={clsx("p-button-text", classes.bottomBarBtn)}
                    label={"Отменить"}
                    disabled={fetchSave}
                    onClick={()=>{
                        setEdit(false)
                    }}
                />
                <Button
                    className={classes.bottomBarBtn}
                    label={"Сохранить"}
                    loading={fetchSave}
                    onClick={save}
                />
            </div>
        </div>
    );
};

export default EditUser;