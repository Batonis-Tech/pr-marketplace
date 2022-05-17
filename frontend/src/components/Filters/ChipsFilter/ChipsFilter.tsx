import React, {FC} from 'react';
import classes from "./ChipsFilter.module.scss"
import {Chips} from "primereact/chips";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {filtersSlice} from "../../../redux/reducers/FiltersReducer/FiltersSlice";

interface ChipsFilterProps {
    label?: string,
}

const ChipsFilter: FC<ChipsFilterProps> = ({label}) => {
    const dispatch = useAppDispatch()
    const value = useAppSelector(state => state.filtersReducer.string.keywords)
    return (
        <div>
            {label &&
                <div className={classes.label}>{label}</div>
            }
            <Chips
                value={value}
                onChange={(e) => dispatch(filtersSlice.actions.setValueKeywords(e.value))}
                /*separator=","*/
                className={classes.chips}
            />
        </div>
    );
};

export default ChipsFilter;