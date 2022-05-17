import React, {FC, useEffect, useState} from 'react';
import classes from "./DropdownRange.module.scss"
import {Dropdown} from "primereact/dropdown";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {filtersSlice, IKeysForMultiSelectRange} from "../../../redux/reducers/FiltersReducer/FiltersSlice";

interface DropdownRangeProps {
    placeholder?: string,
    label?: string,
    min: number,
    max: number,
    step: number,
    filterName: IKeysForMultiSelectRange
}

const DropdownRange: FC<DropdownRangeProps> = ({placeholder, label, min, max, step, filterName}) => {
    const [values, setValues] = useState<any[]>([])
    const value = useAppSelector(state => state.filtersReducer.multiSelectRange[filterName].values)
    const dispatch = useAppDispatch()
    useEffect(()=>{
        let temp = []
        for(let i = 0; i < (max-min)/step; i++){
            temp.push({name: `От ${min+step*i} до ${min+step*(i+1)}`, id: (i+1)*step})
        }
        setValues([...temp])
    },[])

    return (
        <div className={classes.inner}>
            {label &&
			<div className={classes.label}>{label}</div>
            }
            <Dropdown
                optionLabel="name"
                optionValue="id"
                value={value}
                options={values}
                onChange={(e) => dispatch(filtersSlice.actions.setValueMultiSelectRange({nameFilter: filterName, value: e.value, step: step}))}
                placeholder={placeholder ?? `От ${min} до ${max}`}
                className={classes.dropdown}
                showClear
                emptyMessage={"Нет доступных вариантов"}
                emptyFilterMessage={"Не найдено"}
            />
        </div>
    );
};

export default DropdownRange;
