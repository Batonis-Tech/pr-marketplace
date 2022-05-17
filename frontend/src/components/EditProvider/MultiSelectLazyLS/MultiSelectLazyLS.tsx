import React, {FC, useState} from 'react';
import classes from './MultiSelectLazyLS.module.scss'
import {filterTextAPI} from "../../../redux/services/FilterTextService";
import {MultiSelect} from "primereact/multiselect";
import {filtersSlice} from "../../../redux/reducers/FiltersReducer/FiltersSlice";
import clsx from "clsx";

interface MultiSelectLazyLSProps {
    placeholder?: string,
    label?: string,
    path: string,
    required?: boolean,
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
    value?: any,
    setValue?: (value: any) => void,
    type?: "country" | "state" | "city",
    state?: any,
    country? : any
}

const MultiSelectLazyLs: FC<MultiSelectLazyLSProps> = (
    {placeholder, label, path, required = false, value, setValue, type, state, country, isRequired, setIsRequired}
) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1000)
    const [skip, setSkip] = useState<boolean>(true)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({
        path: path,
        page: page,
        page_size: pageSize,
        country: (type === "state" || type === "city") ? country : undefined,
        state: type === "city" ? state : undefined
    }, {skip: skip && value === null || (type === "city" && (country === null || type === null)) || (type === "state" && country === null)})

    const [localValue, setLocalValue] = useState()

    let disable = !!error

    if(type == "state"){
        disable = !!error || country === null || country === []
    }

    if(type == "city"){
        disable = !!error || !country || country === [] || !state || state === []
    }

    return (
        <div className={classes.inner}>
            {label &&
                <div className={clsx(classes.label, required && classes.labelRequired)}>{label}</div>
            }
            <div className={classes.dropdownInner}>
                <MultiSelect
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
                    className={clsx(classes.dropdown, isRequired && required && (value === [] || value === null) && "p-invalid block")}
                    showClear
                    filter
                    disabled={disable}
                    emptyFilterMessage={"Не найдено"}
                    onFocus={()=>{setSkip(false)}}
                />
                {isLoading &&
                    <div className={classes.loaderInner}>
                        <i className="pi pi-spin pi-spinner"/>
                    </div>
                }
                {isRequired && required && (value === [] || value === null) ? (
                    <div className={classes.inputError}>Заполните поле</div>
                ) : null}
            </div>
        </div>
    );
};

export default MultiSelectLazyLs;