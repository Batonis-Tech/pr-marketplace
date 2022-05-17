import React, {FC, useState} from 'react';
import classes from "./OneInput.module.scss"
import {InputNumber} from "primereact/inputnumber";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {filtersSlice, IKeysForInputNumber} from "../../../redux/reducers/FiltersReducer/FiltersSlice";

interface OneInputProps {
    label?: string,
    placeholder: string,
    filterName: IKeysForInputNumber
}

const OneInput: FC<OneInputProps> = ({label, placeholder, filterName}) => {
    const [oneValue, setOneValue] = useState<number | null>(null)
    const value = useAppSelector(state => state.filtersReducer.inputNumber[filterName])
    const dispatch = useAppDispatch()
    return (
        <div className={classes.inner}>
            {label &&
			    <div className={classes.label}>{label}</div>
            }
            <InputNumber className={classes.input} placeholder={placeholder} value={value} onValueChange={(e) => dispatch(filtersSlice.actions.setValueInputNumber({nameFilter: filterName, value: e.value}))} />
        </div>
    );
};

export default OneInput;
