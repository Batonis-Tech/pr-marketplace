import React, {FC, RefObject, useState} from 'react';
import classes from "./ProviderInfo.module.scss"
import Provider from "../Provider/Provider";
import {useOutletContext, useParams} from "react-router-dom";
import {platformPageAPI} from "../../redux/services/PlatformPageService";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {IPlatform} from "../../models/IPlatform";
import clsx from "clsx";
import {ReactComponent as PenSVG} from "../../assets/svg/Pen.svg";
import {Button} from "primereact/button";
import EditProvider from "../EditProvider/EditProvider";
import {Toast} from "primereact/toast";

const ProviderInfo: FC = () => {
    const [edit, setEdit] = useState<boolean>(false)
    const toastRef = useOutletContext<RefObject<Toast>>()

    const {platformId} = useParams()
    const {data: platform, isFetching, error, refetch} = platformPageAPI.useFetchPlatformPageQuery(platformId)

    const optionsBodyTemplate = (rowData: any) => {
        if(rowData?.options && rowData?.options?.length > 0){
            return (
                <div>
                    {rowData.options.map((option: any) => {
                        return(
                            <div key={`${option.id}`}>
                                {option?.name} - <span style={{fontWeight: 500}}>{option.price ? (+option.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) : "не известно"}</span>
                            </div>
                        )
                    })}
                </div>
            )
        }
        return <span>Нет</span>
    }

    const pricePubBodyTemplate = (rowData: any) => {
        return <span>{(+rowData.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
    }

    if(edit){
        return <EditProvider refetch={refetch} platform={platform} setEdit={setEdit} toastRef={toastRef}/>
    }

    return (
        <div style={{position: "relative"}}>
            <Provider platform={platform} fetch={isFetching}/>
            <div style={{paddingBottom: 24}}>
                <div className={classes.pubTitle}>Форматы публикации</div>
                <DataTable
                    value={platform?.products ?? []}
                    dataKey="id"
                    removableSort
                    loading={isFetching}
                    emptyMessage={"Нет форматов"}
                >
                    <Column field="type.name" header="Наименование" style={{ width: 210 }}/>
                    <Column body={pricePubBodyTemplate} header="Стоимость" style={{ width: 220 }}/>
                    <Column body={optionsBodyTemplate} header="Дополнительные услуги" style={{ minWidth: 220 }}/>
                </DataTable>
            </div>
            <Button
                className={clsx("p-button-text", classes.btnEdit)}
                onClick={()=>{setEdit(true)}}
                disabled={isFetching}
            >
                <PenSVG/>
                <span>Редактировать</span>
            </Button>
        </div>
    );
};

export default ProviderInfo;