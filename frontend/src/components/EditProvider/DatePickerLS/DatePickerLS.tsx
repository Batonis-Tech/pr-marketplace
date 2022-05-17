import React, {FC, useState} from 'react';
import classes from "./DatePickerLS.module.scss"
import {Calendar} from "primereact/calendar";
import clsx from "clsx";

interface DatePickerLSProps {
    label?: string,
    required?: boolean,
    placeholder?: string,
    value?: Date | Date[]
    setValue?: (value: Date | Date[] | undefined) => void
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
}

const DatePickerLs: FC<DatePickerLSProps> = ({label, placeholder, required, value, setValue, isRequired, setIsRequired}) => {
    const [localValue, setLocalValue] = useState<Date | Date[] | undefined>(undefined)

    return (
        <div className={classes.inputInner}>
            {label &&
                <div className={clsx(classes.label, required && classes.labelRequired)}>{label}</div>
            }
            <Calendar
                placeholder={placeholder}
                className={clsx(classes.input, isRequired && required && (value === undefined) && "p-invalid block")}
                dateFormat="dd/mm/yy"
                value={value ?? localValue}
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
            />
            {isRequired && required && (value === undefined) ? (
                <div className={classes.inputError}>Заполните поле</div>
            ) : null}
        </div>
    );
};

export default DatePickerLs;