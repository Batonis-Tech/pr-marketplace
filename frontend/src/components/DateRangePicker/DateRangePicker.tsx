import React, {FC, useState} from 'react';
import classes from './DateRangePicker.module.scss'
import {Calendar} from "primereact/calendar";

interface DateRangePickerProps {
    label?: string,
    onChangeFirstDate: (value: Date | Date[] | undefined) => void
    onChangeSecondDate: (value: Date | Date[] | undefined) => void
}

const DateRangePicker: FC<DateRangePickerProps> = ({label, onChangeFirstDate, onChangeSecondDate}) => {
    const [firstDate, setFirstDate] = useState<Date | Date[] | undefined>(undefined)
    const [secondDate, setSecondDate] = useState<Date | Date[] | undefined>(undefined)
    return (
        <div className={classes.container}>
            {label &&
                <div className={classes.label}>{label}</div>
            }
            <div className={classes.inner}>
                <Calendar
                    placeholder={"От"}
                    className={classes.input}
                    dateFormat="dd/mm/yy"
                    value={firstDate}
                    onChange={(e) => {
                        setFirstDate(e.value)
                        onChangeFirstDate(e.value)
                    }}
                />
                <Calendar
                    placeholder={"До"}
                    className={classes.input}
                    dateFormat="dd/mm/yy"
                    value={secondDate}
                    onChange={(e) => {
                        setSecondDate(e.value)
                        onChangeSecondDate(e.value)
                    }}
                />
            </div>
        </div>
    );
};

export default DateRangePicker;