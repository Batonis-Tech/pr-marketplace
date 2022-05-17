import React, {FC, useState} from 'react';
import classes from "./MultiSelectLocation.module.scss"
import MultiSelectLazyLS from "../MultiSelectLazyLS/MultiSelectLazyLS";

interface MultiSelectLocationProps {
    country: number[] | null
    setCountry: (value: number[] | null) => void
    state: number[] | null
    setState: (value: number[] | null) => void
    city: number[] | null
    setCity: (value: number[] | null) => void
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
}

const MultiSelectLocation: FC<MultiSelectLocationProps> = ({country, setCountry, setCity, city, state, setState, setIsRequired, isRequired}) => {

    return (
        <>
         <MultiSelectLazyLS
             value={country}
             setValue={(value)=>{
                 setCountry(value)
                 setState(null)
                 setCity(null)
             }}
             isRequired={isRequired}
             setIsRequired={setIsRequired}
             required
             placeholder={"Выберите страну"}
             label={"Страна"}
             path={"geo/countries"}
             type={"country"}
         />
         <MultiSelectLazyLS
             value={state}
             setValue={(value)=>{
                 setState(value)
                 setCity(null)
             }}
             placeholder={"Выберите регион "}
             label={"Регион"}
             path={"geo/states"}
             type={"state"}
             country={country}
         />
         <MultiSelectLazyLS
             value={city}
             setValue={(value)=>setCity(value)}
             placeholder={"Выберите город"}
             label={"Город"}
             path={"geo/cities"}
             type={"city"}
             country={country}
             state={state}
         />
        </>
    );
};

export default MultiSelectLocation;