import React, {FC, useState} from 'react';
import classes from './CheckboxesLazy.module.scss'
import {filterTextAPI} from "../../../redux/services/FilterTextService";
import {Checkbox} from "primereact/checkbox";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {filtersSlice} from "../../../redux/reducers/FiltersReducer/FiltersSlice";



const CheckboxesLazy: FC = () => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1000)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({path: "providers/aggregators", page: page, page_size: pageSize})

    const values = useAppSelector(state => state.filtersReducer.string.aggregators)
    const valueWriting = useAppSelector(state => state.filtersReducer.boolean.writing)

    const dispatch = useAppDispatch()

    return (
        <>
            {arrayValues &&
                <>
                    {Array.from({length: Math.ceil(arrayValues.results.length/2)}, (_, i) =>
                        <div className={classes.inner} key={`CheckboxesLazy${i}`}>
                            <div className={classes.checkboxInner}>
                                <Checkbox
                                    inputId={`arg${i*2}`}
                                    checked={values.indexOf(arrayValues.results[i*2].id) !== -1}
                                    onChange={()=>{
                                        let tempAggregators = [...values]
                                        if(values.indexOf(arrayValues.results[i*2].id) !== -1){
                                            tempAggregators = tempAggregators.filter(id => id !== arrayValues.results[i*2].id)
                                        }else{
                                            tempAggregators.push(arrayValues.results[i*2].id)
                                        }
                                        dispatch(filtersSlice.actions.setValueAggregators([...tempAggregators]))
                                    }}
                                    className={classes.checkbox}
                                />
                                <label htmlFor={`arg${i*2}`} className={classes.checkboxLabel}>{arrayValues.results[i*2].name}</label>
                            </div>
                            {arrayValues.results.length-1 >= i*2+1 &&
                                <div className={classes.checkboxInner}>
                                    <Checkbox
                                        inputId={`arg${i*2+1}`}
                                        checked={values.indexOf(arrayValues.results[i*2+1].id) !== -1}
                                        onChange={()=>{
                                            let tempAggregators = [...values]
                                            if(values.indexOf(arrayValues.results[i*2+1].id) !== -1){
                                                tempAggregators = tempAggregators.filter(id => id !== arrayValues.results[i*2+1].id)
                                            }else{
                                                tempAggregators.push(arrayValues.results[i*2+1].id)
                                            }
                                            dispatch(filtersSlice.actions.setValueAggregators([...tempAggregators]))
                                        }}
                                        className={classes.checkbox}
                                    />
                                    <label htmlFor={`arg${i*2+1}`} className={classes.checkboxLabel}>{arrayValues.results[i*2+1].name}</label>
                                </div>
                            }
                        </div>
                    )}
                </>
            }
            <div className={classes.inner}>
                <div className={classes.checkboxInner}>
                    <Checkbox inputId="writing" checked={valueWriting} onChange={()=>dispatch(filtersSlice.actions.setValueWriting(!valueWriting))} className={classes.checkbox} />
                    <label htmlFor="writing" className={classes.checkboxLabel}>Написание публикации</label>
                </div>
            </div>
        </>
    );
};

export default CheckboxesLazy;
