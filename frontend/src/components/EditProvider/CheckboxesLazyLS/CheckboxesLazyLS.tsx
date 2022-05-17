import React, {FC, useState} from 'react';
import classes from './CheckboxesLazyLS.module.scss'
import {filterTextAPI} from "../../../redux/services/FilterTextService";
import {Checkbox} from "primereact/checkbox";

interface CheckboxesLazyLSProps {
    values: number[]
    setValues: (value: number[]) => void
}

const CheckboxesLazyLs: FC<CheckboxesLazyLSProps> = ({values, setValues}) => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(1000)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({path: "providers/aggregators", page: page, page_size: pageSize})

    if(!arrayValues || isLoading){
        return null
    }

    return (
        <>
            {arrayValues.results.map((chbox, index)=>{
                return(
                    <div key={`checbk${index}`} className={classes.inner}>
                        <div className={classes.checkboxInner}>
                            <Checkbox
                                inputId={`${chbox.id}`}
                                checked={values.indexOf(chbox.id) !== -1}
                                onChange={()=> {
                                    let tempValues = [...values]
                                    if(values.indexOf(chbox.id) !== -1){
                                        tempValues = tempValues.filter(id => id !== chbox.id)
                                    }else{
                                        tempValues.push(chbox.id)
                                    }
                                    setValues([...tempValues])
                                }}
                                className={classes.checkbox}
                            />
                            <label htmlFor={`${chbox.id}`} className={classes.checkboxLabel}>{chbox.name}</label>
                        </div>
                    </div>
                )
            })}
        </>
    );
};

export default CheckboxesLazyLs;