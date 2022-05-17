import React, {FC} from 'react';
import classes from "./Platforms.module.scss"
import Platform from "../Platform/Platform";
import {IPlatform} from "../../models/IPlatform";
import {Skeleton} from "primereact/skeleton";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {IFilterValue} from "../../models/IFilterValue";
import {Link} from "react-router-dom";

interface PlatformsProps {
    totalCount: number | undefined,
    platforms: IPlatform[],
    isFetching: boolean
}

const Platforms: FC<PlatformsProps> = ({totalCount, platforms, isFetching}) => {

    const nameBodyTemplate = (rowData: IPlatform) => {
        return <Link to={`/platform/${rowData.id}`} className={classes.titleProvider}>{rowData.name}</Link>
    }

    const regionBodyTemplate = (rowData: IPlatform) => {
        let array: IFilterValue[] = []
        if(rowData.country){
            array = [...array, ...rowData.country]
        }
        /*if(rowData.state){
            array = [...array, ...rowData.state]
        }
        if(rowData.city){
            array = [...array, ...rowData.city]
        }*/
        return(
            <span>{array.map(obj => obj.name).join(", ")}</span>
        )
    }

    const typesBodyTemplate = (rowData: IPlatform) => {
        if(rowData.types){
            return <span>{rowData.types.map(obj => obj.name).join(", ")}</span>
        }
        return null
    }

    const themesBodyTemplate = (rowData: IPlatform) => {
        if(rowData.themes){
            return <span>{rowData.themes.map(obj => obj.name).join(", ")}</span>
        }
        return null
    }

    const pubBodyTemplate = (rowData: IPlatform) => {
        if(rowData.products && rowData.products.length > 0){
            return (
                <div>
                    {rowData.products.map(product => {
                        return(
                            <div key={`${product.id}`}>
                                {product.type.name} - <span style={{fontWeight: 500}}>{product.price ? (+product.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) : "не известно"}</span>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return <span>Нет</span>
    }

    if(isFetching){
        return (
            <div className={classes.container}>
                <Skeleton width="300px" height="25px" className={classes.title}/>
                <Skeleton width="100%" height="132px" className={classes.title}/>
                <Skeleton width="100%" height="132px" className={classes.title}/>
            </div>
        )
    }
    return (
        <div className={classes.container}>
            <div className={classes.title}>{totalCount?.toLocaleString() ?? 0} площадок</div>
            <DataTable
                value={platforms}
                dataKey="id"
                removableSort
                loading={isFetching}
                emptyMessage={"Нет площадок"}
            >
                <Column body={nameBodyTemplate} field="name" header="Площадка" style={{ width: 210 }}/>
                <Column body={regionBodyTemplate} header="Регион" style={{ width: 160 }}/>
                <Column body={typesBodyTemplate} field="product.type.name" header="Тип сайта" style={{ width: 220 }}/>
                <Column body={themesBodyTemplate} header="Темы" style={{ width: 220 }}/>
                <Column body={pubBodyTemplate} header="Публикация" style={{ minWidth: 220 }}/>
            </DataTable>
        </div>
    )
    /*return (
        <div className={classes.container}>
            <div className={classes.title}>Найдено {totalCount?.toLocaleString()} площадок</div>
            {platforms.length > 0 ?
                <>
                    {platforms.map(platform => {
                        return(
                            <Platform platform={platform} key={`platform${platform.id}`}/>
                        )
                    })}
                </>:
                <div>
                    Ничего не найдено...
                </div>
            }

        </div>
    );*/
};

export default Platforms;
