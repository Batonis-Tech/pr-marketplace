import React, {FC, useState} from 'react';
import classes from './InputTextLS.module.scss'
import {InputText} from "primereact/inputtext";
import clsx from "clsx";

interface InputTextLsProps {
    placeholder?: string,
    label?: string,
    required?: boolean,
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
    styleInner?: React.CSSProperties,
    value?: string,
    setValue?: (value: string) => void
}

const InputTextLs: FC<InputTextLsProps> = ({placeholder, label, required = false, styleInner, value, setValue, isRequired, setIsRequired}) => {

    //todo
    const [localValue, setLocalValue] = useState<string>("")

    return (
        <div className={classes.inputInner} style={styleInner}>
            {label &&
                <div className={clsx(classes.label, required && classes.labelRequired)}>{label}</div>
            }
            <InputText
                className={clsx(classes.input, isRequired && required && value === "" && "p-invalid block")}
                value={value ?? localValue}
                placeholder={placeholder}
                onChange={e => {
                    if(setValue){
                        if(setIsRequired){
                            setIsRequired(false)
                        }
                        setValue(e.target.value)
                    }else{
                        setLocalValue(e.target.value)
                    }
                }}
            />
            {isRequired && required && value === "" ? (
                <div className={classes.inputError}>Заполните поле</div>
            ) : null}
        </div>
    );
};

export default InputTextLs;