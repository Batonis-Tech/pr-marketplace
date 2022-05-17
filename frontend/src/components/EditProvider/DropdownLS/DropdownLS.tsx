import React, {FC, useState} from 'react';
import classes from './DropdownLS.module.scss'
import {filterTextAPI} from "../../../redux/services/FilterTextService";
import {Dropdown} from "primereact/dropdown";
import clsx from "clsx";

interface DropdownLsProps {
    placeholder?: string,
    label?: string,
    path: string,
    required?: boolean,
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
    value?: any,
    setValue?: (value: any) => void
}

const DropdownLs: FC<DropdownLsProps> = ({placeholder, label, path, required = false, value, setValue, isRequired, setIsRequired}) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1000)
    const [skip, setSkip] = useState<boolean>(true)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({path: path, page: page, page_size: pageSize}, {skip: skip && value === null})

    //todo
    const [localValue, setLocalValue] = useState<any>(null)

    return (
        <div className={classes.inner}>
            {label &&
                <div className={clsx(classes.label, required && classes.labelRequired)}>{label}</div>
            }
            <div className={classes.dropdownInner}>
                <Dropdown
                    optionLabel="name"
                    optionValue="id"
                    value={value ?? localValue}
                    options={arrayValues ? arrayValues.results : []}
                    onChange={(e) => {
                        if(setValue){
                            if(setIsRequired){
                                setIsRequired(false)
                            }
                            setValue(e.value)
                        }else{
                            setLocalValue(e.value)
                        }
                    }}
                    placeholder={placeholder}
                    className={clsx(classes.dropdown, isRequired && required && value === undefined && "p-invalid block")}
                    showClear
                    disabled={!!error}
                    filter
                    showFilterClear
                    emptyMessage={isLoading ? "Загрузка..." : "Нет доступных вариантов"}
                    emptyFilterMessage={"Не найдено"}
                    onFocus={()=>{setSkip(false)}}
                />
                {isLoading &&
                    <div className={classes.loaderInner}>
                        <i className="pi pi-spin pi-spinner"/>
                    </div>
                }
                {isRequired && required && value === undefined ? (
                    <div className={classes.inputError}>Заполните поле</div>
                ) : null}
            </div>
        </div>
    );
};

export default DropdownLs;