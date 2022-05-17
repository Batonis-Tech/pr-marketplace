import React, {FC, useEffect, useRef, useState} from 'react';
import classes from './Basket.module.scss'
import Header from "../../components/Header/Header";
import {Card} from "primereact/card";
import clsx from "clsx";
import catalog from "../Catalog/Catalog";
import {Divider} from "primereact/divider";
import {Dropdown} from "primereact/dropdown";
import {filtersSlice} from "../../redux/reducers/FiltersReducer/FiltersSlice";
import DropdownPayment from "../../components/DropdownPayment/DropdownPayment";
import {Button} from "primereact/button";
import {ReactComponent as DocumentInfo} from "../../assets/svg/DocumentInfo.svg";
import {Checkbox} from "primereact/checkbox";
import {Panel} from "primereact/panel";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tooltip} from "primereact/tooltip";
import {Editor} from "primereact/editor";
import {InputText} from "primereact/inputtext";
import {IBasketItem, IBasketItemForLS} from "../../models/IBasketItem";
import {basketAPI} from "../../api/api";
import {IProduct} from "../../models/IProduct";
import {ReactComponent as DocumentSVG} from "../../assets/svg/Document.svg";
import {MultiSelect} from "primereact/multiselect";
import {filterTextAPI} from "../../redux/services/FilterTextService";
import {Skeleton} from "primereact/skeleton";
import ModalQuillTaskForBasket from "../../components/Modals/ModalQuillTaskForBasket/ModalQuillTaskForBasket";
import {Toast} from "primereact/toast";
import ModalCreateOrder from "../../components/Modals/ModalCreateOrder/ModalCreateOrder";
import {useSearchParams} from "react-router-dom";

interface ProviderForDT {
    product: number,
    provider: {
        name: string,
        products: IProduct[]
    }
}

const Basket: FC = () => {
    const [selectedProducts, setSelectedProducts] = useState<any>([])
    const [expandedRows, setExpandedRows] = useState<any>(null)

    const [basket, setBasket] = useState<IBasketItemForLS[]>(localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket") as string) : [])
    const [providers, setProviders] = useState<Array<any>>([])
    const [isFetching, setIsFetching] = useState(false)

    const [typeProd, setTypeProd] = useState(null)
    const [writeText, setWriteText] = useState(null)

    const [textLinks, setTextLinks] = useState('')

    const [publication, setPublication] = useState(null)
    const [task, setTask] = useState(null)

    const [textState, setTextState] = useState<any>()

    const [showModalTaskQuill,  setShowModalTaskQuill] = useState({visible: false, data: null})

    const [showModalCreateOrder, setShowModalCreateOrder] = useState(false)

    const [fetch, setFetch] = useState<number[]>([])

    const [fetchDelete, setFetchDelete] = useState(false)

    const toastRef = useRef<Toast>(null)

    let [searchParams, setSearchParams] = useSearchParams()

    const [skip, setSkip] = useState<boolean>(true)
    const {data: arrayValues, isLoading, error} = filterTextAPI.useFetchTextFilterQuery({
        path: "products/types",
        page: 1,
        page_size: 1000,
    }, {skip: skip})

    useEffect(()=>{
        localStorage.removeItem("basket")
        setIsFetching(true)
        basketAPI.getBasket(searchParams.toString())
            .then(response => {
                setProviders(response.data.results)
                setIsFetching(false)
            })
            .catch(error => {
                setIsFetching(false)
            })
    }, [searchParams])

    const updateSearchParams = (newParamKey: string, newParamValue: string | null | undefined) => {
        if(newParamValue){
            searchParams.set(newParamKey, newParamValue)
        }else{
            searchParams.delete(newParamKey)
        }
        setSearchParams(searchParams)
    }

    const products = [
        {name: "factroom.ru", id: 1},
        {name: "vlada-rykova.com", id: 2},
        {name: "jora-rykov.ru", id: 3},
    ]

    const typesProd = [
        {name: "Статья – 2 500 ₽", id: 1},
        {name: "Пресс-релиз – 1 500 ₽", id: 2},
    ]

    const writeTextValues = [
        {name: "Создано", id: "True"},
        {name: "Не создано", id: "False"}
    ]

    const rowExpansionTemplate = (data: any) => {
        let tempProd: any = []
        data?.provider?.products.forEach((product: any) => {
            tempProd.push({id: product.id, name: product.type.name})
        })
        let tempOptions: any = []
        data?.options.map((opt: any) => {
            tempOptions.push(opt?.option?.id)
        })
        return (
            <div style={{paddingLeft: 32}}>
                <div className={classes.row}>
                        <Dropdown
                            optionLabel="name"
                            optionValue="id"
                            value={data?.product?.id}
                            options={tempProd}
                            onChange={(e) => {
                                setFetch(prev => [...prev, data.id])
                                basketAPI.updateProductInBasket(data.id as number, {product: e.value, options: []})
                                    .then(response => {
                                        let tempProviders: any = []
                                        let tempSelectedProducts: any = []
                                        providers.forEach(provider => {
                                            if(provider.id === data.id){
                                                tempProviders.push({...response.data})
                                            }else{
                                                tempProviders.push({...provider})
                                            }
                                        })
                                        selectedProducts.forEach((provider: any) => {
                                            if(provider.id === data.id){
                                                tempSelectedProducts.push({...response.data})
                                            }else{
                                                tempSelectedProducts.push({...provider})
                                            }
                                        })
                                        setProviders([...tempProviders])
                                        setSelectedProducts([...tempSelectedProducts])
                                        setFetch(prev => prev.filter(item => item !== data.id))
                                    })
                                    .catch(error => {
                                        setFetch(prev => prev.filter(item => item !== data.id))
                                    })
                            }}
                            placeholder={"Тип публикации"}
                            className={clsx(classes.dropdown, classes.dropdownTypesProd)}
                            emptyMessage={"Нет доступных вариантов"}
                            emptyFilterMessage={"Не найдено"}
                        />
                    <Button
                        disabled={fetch.indexOf(data.id) !== -1}
                        className={clsx(classes.btnTask, "p-button-text")}
                        onClick={()=>setShowModalTaskQuill({visible: true, data: data})}
                    ><DocumentSVG/>Задание</Button>
                </div>
                <div className={classes.optionsTitle}>{data.product.options.length === 0 ? "Нет услуг" : "Услуги"}</div>

                <div className={classes.checkboxes}>
                    {data.product.options.map((option: any) => {
                        return(
                            <div key={`check${option.id}`} className={classes.checkboxItem}>
                                <div className={classes.checkboxInner}>
                                    <Checkbox
                                        inputId={`check${option.id}`}
                                        checked={tempOptions.indexOf(option.id) !== -1}
                                        disabled={fetch.indexOf(data.id) !== -1}
                                        onChange={()=>{
                                            setFetch(prev => [...prev, data.id])
                                            if(tempOptions.indexOf(option.id) !== -1){
                                                tempOptions = tempOptions.filter((opt: any) => opt !== option.id)
                                            }else{
                                                tempOptions.push(option.id)
                                            }
                                            basketAPI.updateProductInBasket(data.id as number, {product: data.product.id, options: [...tempOptions]})
                                                .then(response => {
                                                    let tempProviders: any = []
                                                    let tempSelectedProducts: any = []
                                                    providers.forEach(provider => {
                                                        if(provider.id === data.id){
                                                            tempProviders.push({...response.data})
                                                        }else{
                                                            tempProviders.push({...provider})
                                                        }
                                                    })
                                                    selectedProducts.forEach((provider: any) => {
                                                        if(provider.id === data.id){
                                                            tempSelectedProducts.push({...response.data})
                                                        }else{
                                                            tempSelectedProducts.push({...provider})
                                                        }
                                                    })
                                                    setProviders([...tempProviders])
                                                    setSelectedProducts([...tempSelectedProducts])
                                                    setFetch(prev => prev.filter(item => item !== data.id))
                                                })
                                                .catch(error => {
                                                    setFetch(prev => prev.filter(item => item !== data.id))
                                                })
                                        }}
                                        className={classes.checkbox}
                                    />
                                    <label htmlFor={`check${option.id}`} className={classes.checkboxLabel}>{option.name}</label>
                                </div>
                                <div className={classes.checkboxPrice}>{(+option.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const footerCard = (
        <>
            <Button label={"Оплатить 5 000 ₽"} className={classes.btnCard}/>
        </>
    )

    const taskTextBodyTemplate = (rowData: any) => {
        if(fetch.indexOf(rowData.id) !== -1){
            return <Skeleton width={"90px"} height={"27px"}/>
        }
        return rowData.quill_task ? <span>Создано</span> : <span style={{color: "#FF6F00"}}>Не создано</span>
    }

    const pricePubBodyTemplate = (rowData: any) => {
        if(fetch.indexOf(rowData.id) !== -1){
            return <Skeleton width={"90px"} height={"27px"}/>
        }
        return <span>{(+rowData.product.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
    }

    const utilsBodyTemplate = (rowData: any) => {
        if(fetch.indexOf(rowData.id) !== -1){
            return <Skeleton width={"35px"} height={"27px"}/>
        }
        return <span>{rowData.options.length}</span>
    }

    const totalPriceBodyTemplate = (rowData: any) => {
        if(fetch.indexOf(rowData.id) !== -1){
            return <Skeleton width={"90px"} height={"27px"}/>
        }
        return <span>{(+rowData.total_cost).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
    }

    const publicationBodyTemplate = (rowData: any) => {
        if(fetch.indexOf(rowData.id) !== -1){
            return <Skeleton width={"90px"} height={"27px"}/>
        }
        return <span>{rowData.product.type.name}</span>
    }

    return (
        <>
            <Header/>
            <div className={classes.container}>
                <div className={classes.title}>Список покупок</div>
                <div className={classes.filters}>
                    <div className={classes.dropdownInner} style={{marginRight: 32}}>
                        <div className={classes.dropdownLabel}>Публикация</div>
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
                                emptyMessage={isLoading ? "Загрузка..." : "Нет доступных вариантов"}
                                emptyFilterMessage={"Не найдено"}
                                onFocus={()=>{setSkip(false)}}
                            />
                            {isLoading &&
                                <div className={classes.loaderInner}>
                                    <i className="pi pi-spin pi-spinner"/>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={classes.dropdownInner}>
                        <div className={classes.dropdownLabel}>Задание</div>
                        <Dropdown
                            optionLabel="name"
                            optionValue="id"
                            value={task}
                            options={writeTextValues}
                            onChange={(e) => {
                                setTask(e.value)
                                updateSearchParams("task", e.value)
                            }}
                            placeholder={"Все"}
                            className={clsx(classes.dropdown, classes.dropdownTypesProd)}
                            showClear
                            emptyMessage={"Нет доступных вариантов"}
                            emptyFilterMessage={"Не найдено"}
                        />
                    </div>
                </div>
                <div className={classes.headerBtns}>
                    <Button
                        className={clsx("p-button-text", classes.btn)}
                        style={{width: 180}}
                        loading={fetchDelete}
                        disabled={selectedProducts.length === 0}
                        onClick={()=>{
                            let arrIndex = selectedProducts.map((provider: any) => provider.id)
                            setFetchDelete(true)
                            basketAPI.actionForSelectProductsInBasket(arrIndex, "delete")
                                .then(response => {
                                    let tempProviders = providers.filter((provider: any) => {
                                        return arrIndex.indexOf(provider.id) === -1
                                    })
                                    setProviders([...tempProviders])
                                    setSelectedProducts([])
                                    toastRef?.current?.show({severity: 'success', summary: 'Удалено из корзины'})
                                })
                                .catch(error => {
                                    toastRef?.current?.show({severity: 'error', summary: 'Не удалено из корзины'})
                                })
                                .finally(()=>{
                                    setFetchDelete(false)
                                })
                        }}
                    ><span style={{marginLeft: fetchDelete ? 12: 0}}>Удалить из списка</span></Button>
                    <div className={classes.row}>
                        {/*<Button className={clsx("p-button-text", classes.btn)} style={{marginRight: 32}}>Экспортировать в CSV</Button>*/}
                        <Button
                            className={classes.btn}
                            style={{width: 170}}
                            onClick={()=>{
                                setShowModalCreateOrder(true)
                            }}
                            disabled={fetch.length !== 0 || selectedProducts.length === 0}
                        >Оплатить</Button>
                    </div>
                </div>
                <DataTable
                    value={providers}
                    selectionMode="checkbox"
                    selection={selectedProducts}
                    onSelectionChange={e => setSelectedProducts(e.value)}
                    dataKey="id"
                    removableSort
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate}
                    loading={isFetching}
                    emptyMessage="Корзина пустая"
                >
                    <Column selectionMode="multiple" headerStyle={{width: '3em'}}/>
                    <Column field="id" header="№" />
                    <Column field="provider.name" header="Площадка" style={{ width: 250 }}/>
                    <Column body={taskTextBodyTemplate} header="Задание" style={{ width: 140 }}/>
                    <Column body={publicationBodyTemplate} field="product.type.name" header="Публикация"/>
                    <Column body={pricePubBodyTemplate} header="Стоимость размещения"/>
                    <Column body={utilsBodyTemplate} header="Услуги"/>
                    <Column body={totalPriceBodyTemplate} header="Итоговая стоимость "/>
                    <Column expander style={{ width: 32 }} />
                </DataTable>
            </div>
            <Toast ref={toastRef} position="bottom-right"/>
            <ModalQuillTaskForBasket
                toastRef={toastRef}
                visible={showModalTaskQuill.visible}
                value={showModalTaskQuill.data}
                onHide={() => setShowModalTaskQuill({visible: false, data: null})}
                updateProviders={(response)=>{
                    let tempProviders: any = []
                    providers.forEach(provider => {
                        if(provider.id === response.data.id){
                            tempProviders.push({...response.data})
                        }else{
                            tempProviders.push({...provider})
                        }
                    })
                    setProviders([...tempProviders])
                }}
            />
            <ModalCreateOrder
                visible={showModalCreateOrder}
                onHide={()=>setShowModalCreateOrder(false)}
                selectProviders={selectedProducts}
                setSelectProviders={setSelectedProducts}
                providers={providers}
                setProviders={setProviders}
                fetch={fetch}
                setFetch={setFetch}
                toastRef={toastRef}
            />
        </>
    );
};

export default Basket;
