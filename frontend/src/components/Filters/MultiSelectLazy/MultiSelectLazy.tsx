import React, {FC, useState} from 'react';
import classes from "./MultiSelectLazy.module.scss"
import {filterTextAPI} from "../../../redux/services/FilterTextService";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {Dropdown} from "primereact/dropdown";
import { MultiSelect } from 'primereact/multiselect';
import {filtersSlice, IKeysForMultiSelect} from "../../../redux/reducers/FiltersReducer/FiltersSlice";
import {IFilterValue} from "../../../models/IFilterValue";

interface MultiSelectLazyProps {
    placeholder?: string,
    label?: string,
    path: string,
    filterName: IKeysForMultiSelect,
}

const MultiSelectLazy: FC<MultiSelectLazyProps> = ({placeholder, label, path, filterName}) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1000)
    const [skip, setSkip] = useState<boolean>(true)

    const dispatch = useAppDispatch()
    const value = useAppSelector(state => state.filtersReducer.multiSelect[filterName])
    const country = useAppSelector(state => state.filtersReducer.multiSelect.country)
    const states = useAppSelector(state => state.filtersReducer.multiSelect.state)

    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({
        path: path,
        page: page,
        page_size: pageSize,
        country: (filterName === "state" || filterName === "city") ? country: undefined,
        state: filterName === "city" ? states: undefined
    }, {skip: skip && value === null || (filterName === "city" && (country === null || states === null)) || (filterName === "state" && country === null)})

    let disable = !!error

    if(filterName == "state"){
        disable = !!error || country === null || country === []
    }

    if(filterName == "city"){
        disable = !!error || country === null || country === [] || states === null || states === []
    }

    return (
        <div className={classes.inner}>
            {label &&
			<div className={classes.label}>{label}</div>
            }
            <div className={classes.dropdownInner}>
                <MultiSelect
                    optionLabel="name"
                    optionValue="id"
                    value={value}
                    options={arrayValues ? arrayValues.results : []}
                    onChange={(e) => {
                        if(filterName === "country"){
                            dispatch(filtersSlice.actions.setValueMultiSelect({nameFilter: "state", value: null}))
                            dispatch(filtersSlice.actions.setValueMultiSelect({nameFilter: "city", value: null}))
                        }
                        if(filterName === "state"){
                            dispatch(filtersSlice.actions.setValueMultiSelect({nameFilter: "city", value: null}))
                        }
                        dispatch(filtersSlice.actions.setValueMultiSelect({nameFilter: filterName, value: e.value}))
                    }}
                    placeholder={placeholder}
                    className={classes.dropdown}
                    showClear
                    disabled={disable}
                    filter
                    /*emptyMessage={isLoading ? "Загрузка..." : "Нет доступных вариантов"}*/
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

export default MultiSelectLazy;
