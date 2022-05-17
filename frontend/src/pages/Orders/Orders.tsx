import React, {FC, useEffect, useRef, useState} from 'react';
import classes from "./Orders.module.scss"
import Header from "../../components/Header/Header";
import {ReactComponent as BillSVG} from "../../assets/svg/Bill.svg";
import {ReactComponent as Search} from "../../assets/svg/Research.svg";
import {ReactComponent as ChatSVG} from "../../assets/svg/Chat.svg";
import {InputText} from "primereact/inputtext";
import clsx from "clsx";
import {Dropdown} from "primereact/dropdown";
import {Link, useSearchParams} from "react-router-dom";
import {ordersAPI} from "../../api/api";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import moment from "moment";
import {Button} from "primereact/button";
import {useAppSelector} from "../../hooks/reduxHooks";
import {MultiSelect} from "primereact/multiselect";
import {filterTextAPI} from "../../redux/services/FilterTextService";
import {convertDateToStringForBackend} from "../../services/convertDateToStringForBackend";
import DateRangePicker from "../../components/DateRangePicker/DateRangePicker";
import {useDebounce} from "usehooks-ts";

const Orders: FC = () => {
    const [search, setSearch] = useState<string>("")
    const debouncedSearch = useDebounce<string>(search, 500)
    const [category, setCategory] = useState(null)
    const [orders, setOrders] = useState([])
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [totalCountOrders, setTotalCountOrders] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const currentAccount = useAppSelector(state => state.userReducer.currentAccount)
    const user = useAppSelector(state => state.userReducer.userData)

    const [skip, setSkip] = useState<boolean>(true)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({
        path: "products/types",
        page: 1,
        page_size: 1000,
    }, {skip: skip})

    const [publication, setPublication] = useState(null)

    const dt = useRef<DataTable>(null);

    let [searchParams, setSearchParams] = useSearchParams()

    const categories = [
        {name: "Оплачено", id: "Оплачено"},
        {name: "Ожидает оплаты", id: "Ожидает оплаты"},
        {name: "Отменен", id: "Отменен"},
        {name: "Отклонен", id: "Отклонен"},
        {name: "Принят в работу", id: "Принят в работу"},
        {name: "Опубликован", id: "Опубликован"},
        {name: "Завершен", id: "Завершен"},
        {name: "Ожидает согласования", id: "Ожидает согласования"},
    ]

    useEffect(()=>{
        setIsFetching(true)
        const idProvider = currentAccount.role === "platform" ? `${currentAccount?.data?.id}` : undefined
        const idUser = currentAccount.role === "user" ? `${user?.id}` : undefined
        ordersAPI.getOrders(searchParams.toString(), idProvider, idUser)
            .then(response => {
                setOrders(response.data.results)
                setTotalCountOrders(response.data.count)
                setIsFetching(false)
            })
            .catch(error => {
                setIsFetching(false)
            })
    },[searchParams])

    useEffect(() => {
        if(debouncedSearch.length > 0){
            updateSearchParams("provider__name", debouncedSearch)
        }else{
            updateSearchParams("provider__name", null)
        }
    }, [debouncedSearch])

    const updateSearchParams = (newParamKey: string, newParamValue: string | null | undefined) => {
        if(newParamValue){
            searchParams.set(newParamKey, newParamValue)
        }else{
            searchParams.delete(newParamKey)
        }
        setSearchParams(searchParams)
    }

    const logoBodyTemplate = (rowData: any) => {
        return <img src={rowData.provider.logo?.thumbnail_url ?? rowData.provider.logo?.image_url ?? undefined} className={classes.contentItemImg} alt={rowData.provider.name}/>
    }

    const numberOrderBodyTemplate = (rowData: any) => {
        return <span>№ {rowData.id}</span>
    }

    const dateBodyTemplate = (rowData: any) => {
        return <span>{moment(new Date(rowData.created)).format("DD.MM.YYYY")}</span>
    }

    const linkBodyTemplate = (rowData: any) => {
        if(!rowData.publication_url){
            return null
        }
        return <a className={classes.linkToPub} href={rowData.publication_url} target={"_blank"}>Публикация</a>
    }

    const priceBodyTemplate = (rowData: any) => {
        return <span>{(+rowData.total_cost).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
    }

    const goToOrderBodyTemplate = (rowData: any) => {
        return <Link to={`/orders/${rowData.id}`}><ChatSVG/></Link>
    }

    const onSelectionChange = (e: any) => {
        setSelectedOrders(e.value);
    }

    const exportCSV = (selectionOnly: boolean) => {
        dt?.current?.exportCSV({ selectionOnly });
    }

    // @ts-ignore
    return (
        <>
            <Header/>
            <div className={classes.container}>
                <div className={classes.title}>Мои заказы</div>
                <div className={classes.contentHeader}>
                    <div className={classes.filters}>
                        <span className="p-input-icon-left" style={{marginRight: 32}}>
                            <Search/>
                            <InputText
                                className={classes.inputSearch}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                }}
                                placeholder="Поиск"
                            />
                        </span>
                        <div className={classes.dropdownInner} style={{marginRight: 32}}>
                            <div className={classes.dropdownLabel}>Тип публикации</div>
                            <div className={classes.multiSelectInner}>
                                <Dropdown
                                    optionLabel="name"
                                    optionValue="id"
                                    value={publication}
                                    options={arrayValues ? arrayValues.results: []}
                                    onChange={(e) => {
                                        setPublication(e.value)
                                        updateSearchParams("product__type", e.value)
                                    }}
                                    placeholder={"Все"}
                                    className={clsx(classes.dropdown, classes.dropdownTypesProd)}
                                    showClear
                                    disabled={!!error}
                                    emptyFilterMessage={"Не найдено"}
                                    emptyMessage={isLoading ? "Загрузка..." : "Нет доступных вариантов"}
                                    onFocus={()=>{setSkip(false)}}
                                />
                                {isLoading &&
                                    <div className={classes.loaderInner}>
                                        <i className="pi pi-spin pi-spinner"/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{marginRight: 32}}>
                            <DateRangePicker
                                onChangeFirstDate={(value)=>{
                                    updateSearchParams("start_date", value ? convertDateToStringForBackend(value as Date) : undefined)
                                }}
                                onChangeSecondDate={(value)=>{
                                    updateSearchParams("end_date", value ? convertDateToStringForBackend(value as Date) : undefined)
                                }}
                                label={"Период"}
                            />
                        </div>


                        <div className={classes.dropdownInner}>
                            <div className={classes.dropdownLabel}>Статус</div>
                            <Dropdown
                                optionLabel="name"
                                optionValue="id"
                                value={category}
                                options={categories}
                                onChange={(e) => {
                                    setCategory(e.value)
                                    updateSearchParams("status", e.value)
                                }}
                                placeholder={"Все"}
                                className={clsx(classes.dropdown, classes.dropdownWriteText)}
                                showClear
                                emptyMessage={"Нет доступных вариантов"}
                                emptyFilterMessage={"Не найдено"}
                            />
                        </div>
                    </div>
                    <div className={classes.btns}>
                        <div>Экспорт в CSV:</div>
                        <Button className={clsx("p-button-text", classes.btnExport)} onClick={()=>exportCSV(true)}>Выбранные</Button>
                        <Button className={clsx("p-button-text", classes.btnExport)} onClick={()=>exportCSV(false)}>Все</Button>
                    </div>
                </div>
                <div className={classes.content}>
                    <DataTable
                        value={orders}
                        dataKey="id"
                        ref={dt}
                        selectionMode="checkbox"
                        selection={selectedOrders}
                        onSelectionChange={onSelectionChange}
                        showGridlines
                        loading={isFetching}
                        emptyMessage={"Нет заказов"}
                    >
                        {/*<Column body={logoBodyTemplate} header=""/>*/}
                        <Column selectionMode="multiple" headerStyle={{width: '3em'}}/>
                        {currentAccount.role === "user" ?
                            <Column field="provider.name" header="Площадка"/>:
                            <Column field="user.name" header="Заказчик"/>
                        }

                        <Column field="id" header="№"/>
                        <Column field="product.type.name" header="Тип публикации" style={{width: 180}}/>
                        <Column body={dateBodyTemplate} field="created" header="Создан"/>
                        <Column body={priceBodyTemplate} field="total_cost" header="Цена"/>
                        <Column field="status" header="Статус"/>
                        <Column body={linkBodyTemplate} field="publication_url" header="Ссылка"/>
                        <Column body={goToOrderBodyTemplate} header="Чат"/>
                    </DataTable>
                </div>
            </div>
        </>
    );
};

export default Orders;
