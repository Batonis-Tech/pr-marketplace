import React, {FC, useState} from 'react';
import classes from "./DropdownBoolean.module.scss"
import {Dropdown} from "primereact/dropdown";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {filtersSlice, IKeysForDropdownBoolean} from "../../../redux/reducers/FiltersReducer/FiltersSlice";

interface DropdownBooleanProps {
    placeholder: string,
    label?: string,
    filterName: IKeysForDropdownBoolean
}

const DropdownBoolean: FC<DropdownBooleanProps> = ({label, placeholder, filterName}) => {
    const value = useAppSelector(state => state.filtersReducer.dropdownBoolean[filterName])

    const dispatch = useAppDispatch()

    const values = [
        {name: "Есть", id: 1},
        {name: "Нет", id: 0},
    ]

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
                onChange={(e) => dispatch(filtersSlice.actions.setValueDropdownBoolean({nameFilter: filterName, value: e.value}))}
                placeholder={placeholder}
                className={classes.dropdown}
                showClear
                emptyMessage={"Нет доступных вариантов"}
                emptyFilterMessage={"Не найдено"}
            />
        </div>
    );
};

export default DropdownBoolean;
