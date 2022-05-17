import React, {FC, useEffect, useRef, useState} from 'react';
import classes from './Wallet.module.scss'
import Header from "../../components/Header/Header";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {ReactComponent as ArrowDown} from "../../assets/svg/DownArrow.svg";
import clsx from "clsx";
import {useOnClickOutside} from "usehooks-ts";
import {ReactComponent as Account} from "../../assets/svg/Account.svg";
import {ReactComponent as NewsPaper} from "../../assets/svg/NewsPaper.svg";
import {ReactComponent as EditSVG} from "../../assets/svg/Pen.svg";
import {Dialog} from "primereact/dialog";
import ModalRequisites from "../../components/Modals/ModalRequisites/ModalRequisites";
import {useAppSelector} from "../../hooks/reduxHooks";
import {Link, useSearchParams} from "react-router-dom";
import {Skeleton} from "primereact/skeleton";
import DateRangePicker from "../../components/DateRangePicker/DateRangePicker";
import {Dropdown} from "primereact/dropdown";
import {balanceAPI} from "../../api/api";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {IPlatform} from "../../models/IPlatform";
import moment from "moment";
import {convertDateToStringForBackend} from "../../services/convertDateToStringForBackend";
import ModalEditRequisites from "../../components/Modals/ModalEditRequisites/ModalEditRequisites";
import ModalWithdrawalMoney from "../../components/Modals/ModalWithdrawalMoney/ModalWithdrawalMoney";
import {Toast} from "primereact/toast";

const Wallet: FC = () => {
    const [showDropdownMenu, setShowDropdownMenu] = useState(false)
    const [showModalRequisites, setShowModalRequisites] = useState(false)
    const [showModalEditRequisites, setShowModalEditRequisites] = useState(false)
    const [showModalWithdrawal, setShowModalWithdrawal] = useState(false)

    const toastRef = useRef<Toast>(null)

    const [typeTranz, setTypeTranz] = useState()

    const dt = useRef<DataTable>(null);

    const refDropdownMenuWallet = useRef(null)

    const myBalance = useAppSelector(state => state.userReducer.myBalance)
    const isLoadingGetMyBalance = useAppSelector(state => state.userReducer.isLoadingGetMyBalance)
    const currentAccount = useAppSelector(state => state.userReducer.currentAccount)

    const handleClickOutside = () => {
        setShowDropdownMenu(false)
    }

    useOnClickOutside(refDropdownMenuWallet, handleClickOutside)

    const [fetchGetMyTransactions, setFetchGetMyTransactions] = useState(false)
    const [transactions, setTransactions] = useState([])

    let [searchParams, setSearchParams] = useSearchParams()

    const typesTranz = [
        {name: "Заморожено", id: "Заморожено"},
        {name: "Разморожено", id: "Разморожено"},
        {name: "Оплата", id: "Оплата"},
        {name: "Вывод средств", id: "Вывод средств"},
        {name: "Начисление средств", id: "Начисление средств"},
        {name: "Комиссия", id: "Комиссия"},
    ]

    const updateSearchParams = (newParamKey: string, newParamValue: string | null | undefined) => {
        if(newParamValue){
            searchParams.set(newParamKey, newParamValue)
        }else{
            searchParams.delete(newParamKey)
        }
        setSearchParams(searchParams)
    }

    useEffect(()=>{
        setFetchGetMyTransactions(true)
        balanceAPI.getTransactions(searchParams.toString())
            .then(response => {
                setTransactions(response.data)
            })
            .catch(error => {

            })
            .finally(()=>{
                setFetchGetMyTransactions(false)
            })
    }, [searchParams])

    const footerSidebar = (
        <div className={classes.dropdownMenuInner}>
            {currentAccount.role === "user" ?
                <Button
                    className={classes.btn}
                    onClick={()=>setShowDropdownMenu(true)}
                >
                    <span>Пополнить</span>
                    <ArrowDown/>
                </Button>:
                <Button
                    className={classes.btn}
                    onClick={()=>setShowModalWithdrawal(true)}
                >
                    <span>Вывести</span>
                </Button>
            }

            {showDropdownMenu &&
                <div ref={refDropdownMenuWallet} className={classes.dropdownMenu}>
                    <div
                        className={classes.dropdownMenuItem}
                        onClick={()=>{
                            setShowDropdownMenu(false)
                            setShowModalRequisites(true)
                        }}
                    >
                        <div className={classes.dropdownMenuText}>Оплатить по реквизитам</div>
                    </div>
                    {/*<div
                        className={classes.dropdownMenuItem}
                        onClick={()=>{
                            setShowDropdownMenu(false)
                        }}
                    >
                        <div className={classes.dropdownMenuText}>Пополнить с карты</div>
                    </div>*/}
                </div>
            }
        </div>
    )

    const dateBodyTemplate = (rowData: any) => {
        return <span>{moment(new Date(rowData.created_at)).format("DD.MM.YYYY hh:mm")}</span>
    }

    const priceBodyTemplate = (rowData: any) => {
        return <span>{(+rowData.amount).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</span>
    }

    const exportCSV = (selectionOnly: boolean) => {
        dt?.current?.exportCSV({ selectionOnly });
    }

    return (
        <>
            <Header/>
            <div className={classes.container}>
                <div className={classes.title}>Счет</div>
                <div className={classes.colInner}>
                    <div className={classes.col1}>
                        <div
                            className={classes.sidebar}
                        >
                            <Card
                                title={(
                                    <>
                                        <div className={classes.sidebarTitle}>
                                            Доступно
                                            {!isLoadingGetMyBalance ?
                                                <span>{myBalance?.balance ? (+myBalance.balance).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency }): "0 ₽"}</span>:
                                                <Skeleton width={"100px"} height={"30px"}/>
                                            }
                                        </div>
                                        <div className={classes.sidebarTitle}>
                                            Заморожено
                                            {!isLoadingGetMyBalance ?
                                                <span>{myBalance?.freezed_amount ? (+myBalance?.freezed_amount).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency }): "0 ₽"}</span>:
                                                <Skeleton width={"100px"} height={"30px"}/>
                                            }
                                        </div>
                                    </>
                                )}
                                footer={footerSidebar}
                            />
                            {currentAccount.role !== "user" &&
                                <Card
                                    style={{marginTop: 24}}
                                    title={(
                                        <>
                                            <div className={classes.recTitle}>Реквизиты для вывода средств</div>
                                            <div className={classes.recItem}>
                                                <div className={classes.recSubTitle}>Наименование</div>
                                                <div className={classes.recValue}>{myBalance?.payee_name ?? ""}</div>
                                            </div>
                                            <div className={classes.recItem}>
                                                <div className={classes.recSubTitle}>ИНН</div>
                                                <div className={classes.recValue}>{myBalance?.tax_number ?? ""}</div>
                                            </div>
                                            <div className={classes.recItem}>
                                                <div className={classes.recSubTitle}>Наименование банка</div>
                                                <div className={classes.recValue}>{myBalance?.bank_name ?? ""}</div>
                                            </div>
                                            <div className={classes.recItem}>
                                                <div className={classes.recSubTitle}>БИК банка</div>
                                                <div className={classes.recValue}>{myBalance?.bank_BIC ?? ""}</div>
                                            </div>
                                            <div className={classes.recItem}>
                                                <div className={classes.recSubTitle}>Корр. счет</div>
                                                <div className={classes.recValue}>{myBalance?.correspondent_account_number ?? ""}</div>
                                            </div>
                                            <div className={classes.recItem}>
                                                <div className={classes.recSubTitle}>Номер счета</div>
                                                <div className={classes.recValue}>{myBalance?.checking_account ?? ""}</div>
                                            </div>
                                        </>
                                    )}
                                    footer={(
                                        <Button
                                            className={clsx("p-button-text", classes.editBtn)}
                                            onClick={()=>setShowModalEditRequisites(true)}
                                        >
                                            <EditSVG/>
                                            <span>Редактировать</span>
                                        </Button>
                                    )}
                                />
                            }
                        </div>

                    </div>
                    <div className={classes.col2}>
                        <div className={classes.subtitle}>Операции</div>
                        <div className={classes.filters}>
                            <DateRangePicker
                                onChangeFirstDate={(value)=>{
                                    updateSearchParams("start_date", value ? convertDateToStringForBackend(value as Date) : undefined)
                                }}
                                onChangeSecondDate={(value)=>{
                                    updateSearchParams("finish_date", value ? convertDateToStringForBackend(value as Date) : undefined)
                                }}
                                label={"Период"}
                            />
                            <div className={classes.dropdownInner} style={{marginLeft: 32}}>
                                <div className={classes.dropdownLabel}>Тип транзакции</div>
                                <Dropdown
                                    optionLabel="name"
                                    optionValue="id"
                                    value={typeTranz}
                                    options={typesTranz}
                                    onChange={(e) => {
                                        setTypeTranz(e.value)
                                        updateSearchParams("type", e.value)
                                    }}
                                    placeholder={"Все"}
                                    className={clsx(classes.dropdown, classes.dropdownTypesProd)}
                                    showClear
                                    emptyMessage={"Нет доступных вариантов"}
                                    emptyFilterMessage={"Не найдено"}
                                />
                            </div>
                            <Button
                                className={clsx("p-button-text", classes.btnExport)}
                                label={"Экспортировать в CSV"}
                                onClick={()=>{exportCSV(false)}}
                            />
                        </div>
                        <div className={classes.statistics}>
                            {currentAccount.role === "user" ?
                                <>
                                    <div className={classes.statisticsItem}>
                                        Зачислено
                                        <span>{myBalance?.debited_amount ? (+myBalance?.debited_amount).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency ?? "RUB" }): "0 ₽"}</span>
                                    </div>
                                    <div className={classes.statisticsItem}>
                                        Списано
                                        <span>{myBalance?.withdrawed_amount ? (+myBalance?.withdrawed_amount).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency ?? "RUB" }): "0 ₽"}</span>
                                    </div>
                                </>:
                                <>
                                    <div className={classes.statisticsItem}>
                                        Заработано
                                        <span>{myBalance?.earned_amount ? (+myBalance?.earned_amount).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency ?? "RUB" }): "0 ₽"}</span>
                                    </div>
                                    <div className={classes.statisticsItem}>
                                        Выведено
                                        <span>{myBalance?.exported_amount ? (+myBalance?.exported_amount).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency ?? "RUB" }): "0 ₽"}</span>
                                    </div>
                                </>
                            }

                        </div>
                        <div>
                            <DataTable
                                value={transactions}
                                dataKey="id"
                                ref={dt}
                                removableSort
                                loading={fetchGetMyTransactions}
                                emptyMessage={"Нет транзакций"}
                            >
                                <Column field="id" header="№"/>
                                <Column body={dateBodyTemplate} field="created_at" header="Дата и время" />
                                <Column field="type" header="Тип" />
                                <Column field="order.id" header="№ заказа" style={{width: 120}} />
                                {currentAccount.role === "user" ?
                                    <Column field="order.provider.name" header="Площадка" />:
                                    <Column field="order.user.name" header="Заказчик" />
                                }
                                <Column body={priceBodyTemplate} field="amount" header="Сумма" />
                            </DataTable>
                        </div>
                        {/*<div className={classes.operations}>
                            <div className={classes.operation}>
                                <div className={classes.operationTitleInner}>
                                    <div className={classes.operationTitle}>Возврат средств</div>
                                    <div className={classes.operationDate}>14.04.2022</div>
                                </div>
                                <div className={clsx(classes.operationPrice, classes.operationPricePlus)}>+ 5 000 ₽</div>
                            </div>
                            <div className={classes.operation}>
                                <div className={classes.operationTitleInner}>
                                    <div className={classes.operationTitle}>Оплата заказа</div>
                                    <div className={classes.operationDate}>13.04.2022</div>
                                </div>
                                <div className={classes.operationPrice}>- 5 000 ₽</div>
                            </div>
                        </div>*/}
                    </div>
                </div>
            </div>
            <ModalRequisites toastRef={toastRef} visible={showModalRequisites} onHide={()=>setShowModalRequisites(false)}/>
            <ModalEditRequisites accountId={myBalance?.id ?? 0} visible={showModalEditRequisites} onHide={()=>setShowModalEditRequisites(false)}/>
            <ModalWithdrawalMoney toastRef={toastRef} visible={showModalWithdrawal} onHide={()=>setShowModalWithdrawal(false)}/>
            <Toast ref={toastRef} position="bottom-right"/>
        </>
    );
};

export default Wallet;