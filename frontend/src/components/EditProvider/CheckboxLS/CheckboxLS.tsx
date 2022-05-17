import React, {FC, useState} from 'react';
import classes from "./CheckboxLS.module.scss"
import {Checkbox} from "primereact/checkbox";

interface CheckboxLSProps {
    id: string,
    label: string,
    value?: boolean,
    setValue?: (value: boolean) => void
}

const CheckboxLs: FC<CheckboxLSProps> = ({label, id, value, setValue}) => {

    //todo
    const [localValue, setLocalValue] = useState(false)

    return (
        <div className={classes.inner}>
            <div className={classes.checkboxInner}>
                <Checkbox inputId={id} checked={value ?? localValue} onChange={()=>setValue ? setValue(!value) : setLocalValue(!localValue)} className={classes.checkbox} />
                <label htmlFor={id} className={classes.checkboxLabel}>{label}</label>
            </div>
        </div>
    );
};

export default CheckboxLs;