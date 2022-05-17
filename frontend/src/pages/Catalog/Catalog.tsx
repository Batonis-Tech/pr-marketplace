import React, {FC, useEffect, useState} from 'react';
import classes from "./Catalog.module.scss"
import Header from "../../components/Header/Header";
import {Button} from "primereact/button";
import clsx from "clsx";
import { InputText } from 'primereact/inputtext';
import {ReactComponent as Search} from "../../assets/svg/Research.svg";
import Platforms from "../../components/Platforms/Platforms";
import Filters from "../../components/Filters/Filters";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import {filtersSlice} from "../../redux/reducers/FiltersReducer/FiltersSlice";
import {useCatalogFilterQuery} from "../../hooks/useCatalogFilterQuery";
import {catalogAPI} from "../../api/api";
import {Paginator} from "primereact/paginator";
import {getPlatforms} from "../../redux/reducers/CatalogReducer/CatalogActionCreators";

const Catalog: FC = () => {
    const [showFilters, setShowFilters] = useState<boolean>(false)
    const search = useAppSelector(state => state.filtersReducer.search)
    const page = useAppSelector(state => state.filtersReducer.page)
    const page_size = useAppSelector(state => state.filtersReducer.page_size)
    const totalCount = useAppSelector(state => state.catalogReducer.count)
    const platforms = useAppSelector(state => state.catalogReducer.results)
    const isFetchingGetPlatforms = useAppSelector(state => state.catalogReducer.isFetching)
    const dispatch = useAppDispatch()
    const {searchParams, getQuery} = useCatalogFilterQuery()
    useEffect(()=>{
        if(searchParams.toString() === ""){
            getQuery()
        }else{
            dispatch(getPlatforms(searchParams.toString()))
        }
    }, [searchParams])
    return (
        <>
            <Header/>
            <div className={classes.searchBlock}>
                <div className={classes.title}>Каталог площадок</div>
                <div className={classes.searchInner}>
                    <span className="p-input-icon-left">
                        <Search/>
                        <InputText
                            className={classes.inputSearch}
                            value={search}
                            onChange={(e) => dispatch(filtersSlice.actions.setValueSearch(e.target.value))}
                            placeholder="Поиск"
                        />
                    </span>
                    <Button label={"Найти"} onClick={()=>{
                        getQuery()
                    }} className={classes.btnFound}/>
                    <Button
                        label={"Применить фильтры"}
                        className={clsx("p-button-text", classes.btnAddFilters)}
                        onClick={()=>{getQuery()}}
                    />
                    <Button
                        label={showFilters ? "Скрыть фильтры" : "Показать фильтры"}
                        className={clsx("p-button-text", classes.btnShowFilters)}
                        onClick={()=>{setShowFilters(prev => !prev)}}
                    />
                </div>
            </div>
            {showFilters &&
			    <Filters/>
            }
            <Platforms totalCount={totalCount} platforms={platforms} isFetching={isFetchingGetPlatforms}/>
            <div className={classes.container}>
                <Paginator
                    first={page}
                    rows={page_size}
                    totalRecords={totalCount}
                    rowsPerPageOptions={[10, 20, 30]}
                    onPageChange={(e) => {
                        dispatch(filtersSlice.actions.setPage(e.first))
                        dispatch(filtersSlice.actions.setPageSize(e.rows))
                        getQuery({page: e.first, page_size: e.rows})
                    }}
                />
            </div>
        </>
    );
};

export default Catalog;
