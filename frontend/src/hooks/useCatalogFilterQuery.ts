import {useAppSelector} from "./reduxHooks";
import {useSearchParams} from "react-router-dom";
import {useState} from "react";
import {
    IKeysForBoolean, IKeysForDropdownBoolean,
    IKeysForInputNumber,
    IKeysForMultiSelect, IKeysForMultiSelectRange,
    IKeysForString
} from "../redux/reducers/FiltersReducer/FiltersSlice";

export const useCatalogFilterQuery = () => {
    let [searchParams, setSearchParams] = useSearchParams()
    const filters = useAppSelector(state => state.filtersReducer)

    const saveParamsInUrl = (params?: {page: number, page_size: number}) => {
        const urlParams: {[key: string]: string} = {}
        Object.keys(filters).forEach(keyCategory => {
          switch (keyCategory){
              case "search": {
                  if(filters[keyCategory]){
                      urlParams[keyCategory] = <string>filters[keyCategory]
                  }
                  break;
              }
              case "page": {
                  urlParams[keyCategory] = <string>(filters[keyCategory] / filters.page_size + 1).toString()
                  break;
              }
              case "page_size": {
                  if(filters[keyCategory]){
                      urlParams[keyCategory] = <string>filters[keyCategory].toString()
                  }
                  break;
              }
              case "multiSelect":{
                  Object.keys(filters[keyCategory]).forEach(key => {
                      if(filters[keyCategory][key as IKeysForMultiSelect]){
                          urlParams[key] = <string>filters[keyCategory][key as IKeysForMultiSelect]!.toString()
                      }
                  })
                  break;
              }
              case "string": {
                  Object.keys(filters[keyCategory]).forEach(key => {
                      if(filters[keyCategory][key as IKeysForString].length !== 0){
                          urlParams[key] = <string>filters[keyCategory][key as IKeysForString]!.toString()
                      }
                  })
                  break;
              }
              case "boolean": {
                  Object.keys(filters[keyCategory]).forEach(key => {
                      if(filters[keyCategory][key as IKeysForBoolean]){
                          urlParams[key] = <string>filters[keyCategory][key as IKeysForBoolean]!.toString()
                      }
                  })
                  break;
              }
              case "inputNumber": {
                  Object.keys(filters[keyCategory]).forEach(key => {
                      if(filters[keyCategory][key as IKeysForInputNumber]){
                          urlParams[key] = <string>filters[keyCategory][key as IKeysForInputNumber]!.toString()
                      }
                  })
                  break;
              }
              case "dropdownBoolean": {
                  Object.keys(filters[keyCategory]).forEach(key => {
                      if(filters[keyCategory][key as IKeysForDropdownBoolean] !== null && filters[keyCategory][key as IKeysForDropdownBoolean] !== undefined){
                          urlParams[key] = filters[keyCategory][key as IKeysForDropdownBoolean] === 1 ? "true" : "false"
                      }
                  })
                  break;
              }
              case "multiSelectRange": {
                  Object.keys(filters[keyCategory]).forEach(key => {
                      if(filters[keyCategory][key as IKeysForMultiSelectRange].values){
                          console.log(filters[keyCategory][key as IKeysForMultiSelectRange]?.values)
                          urlParams[`${key}_min`] = ((<number>filters[keyCategory][key as IKeysForMultiSelectRange]?.values - 1) * <number>filters[keyCategory][key as IKeysForMultiSelectRange].step).toString()
                          urlParams[`${key}_max`] = (<number>filters[keyCategory][key as IKeysForMultiSelectRange]?.values * <number>filters[keyCategory][key as IKeysForMultiSelectRange].step).toString()
                      }
                  })
                  break;
              }
          }
        })
        if(params){
            Object.keys(params).forEach(keyCategory => {
                switch (keyCategory) {
                    case "page": {
                        urlParams[keyCategory] = <string>(params[keyCategory] / params.page_size + 1).toString()
                        break;
                    }
                    case "page_size": {
                        if(filters[keyCategory]){
                            urlParams[keyCategory] = <string>params[keyCategory].toString()
                        }
                        break;
                    }
                }
            })
        }
        setSearchParams(urlParams)
    }

    return {searchParams: searchParams, getQuery: saveParamsInUrl}
}