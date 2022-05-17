import React, {FC, useState} from 'react';
import classes from './DropdownPayment.module.scss'
import {Dropdown} from "primereact/dropdown";
import {filtersSlice} from "../../redux/reducers/FiltersReducer/FiltersSlice";

const DropdownPayment: FC = () => {

    const [value, setValue] = useState(null)

    const values = [
        {name: "Баланс счета", balance: 5000, id: 1},
        {name: "Бонусы", balance: 0, id: 2},
    ]

    const itemsTemplate = (option: { name: string, balance: number }, props: { placeholder: string }) => {
        if (option) {
            return (
                <div className={classes.item}>
                    <div>{option.name}</div>
                    <div>{option.balance.toLocaleString()} ₽</div>
                </div>
            );
        }
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const optionTemplate = (option: any) => {
        return (
            <div className={classes.item}>
                <div>{option.name}</div>
                <div>{option.balance.toLocaleString()} ₽</div>
            </div>
        );
    }

    return (
        <div className={classes.inner}>
            <div className={classes.label}>Способ оплаты</div>
            <Dropdown
                optionLabel="name"
                optionValue="id"
                value={value}
                options={values}
                onChange={(e) => setValue(e.value)}
                placeholder={"Способ оплаты"}
                className={classes.dropdown}
                showClear
                emptyMessage={"Нет доступных вариантов"}
                emptyFilterMessage={"Не найдено"}
                valueTemplate={itemsTemplate}
                itemTemplate={optionTemplate}
            />
        </div>
    );
};

export default DropdownPayment;