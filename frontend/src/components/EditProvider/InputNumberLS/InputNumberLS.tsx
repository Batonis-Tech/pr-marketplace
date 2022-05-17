import React, {FC, useState} from 'react';
import classes from './InputNumberLS.module.scss'
import {InputNumber} from "primereact/inputnumber";
import clsx from "clsx";

interface InputNumberLsProps {
    placeholder?: string,
    label?: string,
    required?: boolean,
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
    value?: number | null,
    setValue?: (value: number | null) => void,
    max?: number,
    min?: number,
}

const InputNumberLs: FC<InputNumberLsProps> = ({placeholder, label, required = false, value, setValue, isRequired, setIsRequired, max, min}) => {

    //todo
    const [localValue, setLocalValue] = useState<number | null>(null)

    return (
        <div className={classes.inner}>
            {label &&
                <div className={clsx(classes.label, required && classes.labelRequired)}>{label}</div>
            }
            <InputNumber
                className={clsx(classes.input, isRequired && required && value === null && "p-invalid block")}
                placeholder={placeholder}
                max={max}
                min={min}
                value={value ?? localValue}
                onValueChange={(e) => {
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
            {isRequired && required && value === null ? (
                <div className={classes.inputError}>Заполните поле</div>
            ) : null}
        </div>
    );
};

export default InputNumberLs;