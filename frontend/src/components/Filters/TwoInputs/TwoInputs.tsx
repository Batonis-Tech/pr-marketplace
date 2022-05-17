import React, {FC, useState} from 'react';
import classes from './TwoInputs.module.scss'
import { InputNumber } from 'primereact/inputnumber';
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {filtersSlice, IKeysForInputNumber} from "../../../redux/reducers/FiltersReducer/FiltersSlice";

interface TwoInputsProps {
    label?: string,
    filterNameMin: IKeysForInputNumber,
    filterNameMax: IKeysForInputNumber
}

const TwoInputs: FC<TwoInputsProps> = ({label, filterNameMax, filterNameMin}) => {
    const minValue = useAppSelector(state => state.filtersReducer.inputNumber[filterNameMin])
    const maxValue = useAppSelector(state => state.filtersReducer.inputNumber[filterNameMax])
    const dispatch = useAppDispatch()
    return (
        <div className={classes.inner}>
            {label &&
			    <div className={classes.label}>{label}</div>
            }
            <div className={classes.inputs}>
                <InputNumber className={classes.input} placeholder={"От"} value={minValue} onValueChange={(e) => dispatch(filtersSlice.actions.setValueInputNumber({nameFilter: filterNameMin, value: e.value}))} />
                <InputNumber className={classes.input} placeholder={"До"} value={maxValue} onValueChange={(e) => dispatch(filtersSlice.actions.setValueInputNumber({nameFilter: filterNameMax, value: e.value}))} />
            </div>
        </div>
    );
};

export default TwoInputs;
