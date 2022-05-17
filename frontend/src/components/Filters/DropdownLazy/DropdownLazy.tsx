import React, {FC, useEffect, useState} from 'react';
import classes from './DropdownLazy.module.scss'
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import {filterTextAPI} from "../../../redux/services/FilterTextService";
import {oAuthAPI, userAPI} from "../../../api/api";
import {login} from "../../../redux/reducers/UserReducer/UserActionCreators";
import {useAppDispatch} from "../../../hooks/reduxHooks";

interface DropdownLazyProps {
    placeholder?: string,
    label?: string,
    path: string
}

const DropdownLazy: FC<DropdownLazyProps> = ({placeholder, label, path}) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1000)
    const [skip, setSkip] = useState<boolean>(true)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({path: path, page: page, page_size: pageSize}, {skip})

    const dispatch = useAppDispatch()

    const [value, setValue] = useState<any>(null)

    return (
        <div className={classes.inner}>
            {label &&
			    <div className={classes.label}>{label}</div>
            }
            <div className={classes.dropdownInner}>
                <Dropdown
                    optionLabel="name"
                    optionValue="id"
                    value={value}
                    options={arrayValues ? arrayValues.results : []}
                    onChange={(e) => setValue(e.value)}
                    placeholder={placeholder}
                    className={classes.dropdown}
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
            </div>
        </div>
    );
};

export default DropdownLazy;
