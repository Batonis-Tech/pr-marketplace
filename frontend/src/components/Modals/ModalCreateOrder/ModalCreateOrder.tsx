import React, {FC, RefObject, useState} from 'react';
import classes from './ModalCreateOrder.module.scss'
import {Toast} from "primereact/toast";
import {Dialog} from "primereact/dialog";
import {Divider} from "primereact/divider";
import {Checkbox} from "primereact/checkbox";
import {basketAPI} from "../../../api/api";
import {Skeleton} from "primereact/skeleton";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../hooks/reduxHooks";
import {userSlice} from "../../../redux/reducers/UserReducer/UserSlice";


interface ModalCreateOrderProps{
    visible: boolean,
    onHide: () => void,
    toastRef?: RefObject<Toast>,
    selectProviders: any,
    setSelectProviders: (items: any) => void,
    providers: any,
    setProviders: (items: any) => void,
    fetch: number[],
    setFetch: (value: number[] | ((prevVar: number[]) => number[])) => void
}

const ModalCreateOrder: FC<ModalCreateOrderProps> = (
    {visible, onHide, toastRef, selectProviders, setSelectProviders, providers, setProviders, fetch, setFetch}
) => {
    const [tempSelectedProviders, setTempSelectedProviders] = useState<any>([])

    const [fetchCreateOrder, setFetchCreateOrder] = useState(false)

    const myBalance = useAppSelector(state => state.userReducer.myBalance)
    const isLoadingGetMyBalance = useAppSelector(state => state.userReducer.isLoadingGetMyBalance)

    const dispatch = useAppDispatch()

    const ProviderLocal: FC<{provider: any, checkedMain: boolean}> = ({provider, checkedMain}) => {
        return(
            <div className={classes.provider}>
                <div className={classes.row}>
                    <div className={classes.checkboxInner}>
                        <Checkbox
                            className={classes.checkboxMain}
                            inputId={`provider${provider.id}`}
                            name={`provider${provider.id}`}
                            value={provider.id}
                            onChange={()=>{
                                if(checkedMain){
                                    let tempSelectProvider = [...selectProviders]
                                    tempSelectProvider = tempSelectProvider.filter((item: any) => item.id !== provider.id)
                                    setSelectProviders([...tempSelectProvider])
                                }else{
                                    let tempSelectProvider = [...selectProviders]
                                    tempSelectProvider.push({...provider})
                                    setSelectProviders([...tempSelectProvider])
                                }
                            }}
                            checked={checkedMain}
                        />
                        <label className={classes.labelMain} htmlFor={`provider${provider.id}`}>{provider.provider.name}</label>
                    </div>
                    <div className={classes.priceProdTotal}>
                        {fetch.indexOf(provider.id) !== -1 ? <Skeleton width={"90px"} height={"24px"}/> : (+provider.total_cost).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </div>
                </div>
                <div className={classes.row} style={{marginTop: 8}}>
                    <div className={classes.productName}>{provider.product.type.name}</div>
                    <div className={classes.price}>
                        {(+provider.product.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </div>
                </div>

                {tempSelectedProviders.filter((pr: any) => pr.id === provider.id)[0]?.options.map((option: any) => {
                    return(
                        <div className={classes.row} style={{marginTop: 8}}>
                            <div className={classes.checkboxInner} style={{marginLeft: 8}}>
                                <Checkbox
                                    disabled={!checkedMain || fetch.indexOf(provider.id) !== -1}
                                    className={classes.checkbox}
                                    inputId={`option${option.id}`}
                                    name={`option${option.id}`}
                                    value={option.id}
                                    onChange={()=>{
                                        setFetch(prev => [...prev, provider.id])
                                        let tempOptions: any = []
                                        provider?.options.map((opt: any) => {
                                            tempOptions.push(opt?.option?.id)
                                        })
                                        if(provider.options.some((opt: any) => opt.option.id === option.option.id)){
                                            tempOptions = tempOptions.filter((opt: any) => opt !== option.option.id)
                                        }
                                        else{
                                            tempOptions.push(option.option.id)
                                        }
                                        basketAPI.updateProductInBasket(provider.id as number, {product: provider.product.id, options: [...tempOptions]})
                                            .then(response => {
                                                let tempProviders: any = []
                                                let tempSelectedProducts: any = []
                                                providers.forEach((providerLocal: any) => {
                                                    if(providerLocal.id === provider.id){
                                                        tempProviders.push({...response.data})
                                                    }else{
                                                        tempProviders.push({...providerLocal})
                                                    }
                                                })
                                                selectProviders.forEach((providerLocal: any) => {
                                                    if(providerLocal.id === provider.id){
                                                        tempSelectedProducts.push({...response.data})
                                                    }else{
                                                        tempSelectedProducts.push({...providerLocal})
                                                    }
                                                })
                                                setProviders([...tempProviders])
                                                setSelectProviders([...tempSelectedProducts])
                                                setFetch(prev => prev.filter(item => item !== provider.id))
                                            })
                                            .catch(error => {
                                                setFetch(prev => prev.filter(item => item !== provider.id))
                                            })
                                    }}
                                    checked={provider.options.some((opt: any) => opt.option.id === option.option.id)}
                                />
                                <label className={classes.optionName} htmlFor={`provider1`}>{option.option.name}</label>
                            </div>
                            <div className={classes.price}>
                                {option.cost.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                            </div>
                        </div>
                    )
                })}

            </div>
        )
    }

    return (
        <div>
            <Dialog
                header={"Оплата заказа"}
                className={classes.modal}
                onHide={()=>{
                    setTempSelectedProviders([])
                    setFetch([])
                    onHide()
                }}
                onShow={()=>{
                    setTempSelectedProviders([...selectProviders])
                }}
                dismissableMask
                draggable={false}
                visible={visible}
                style={{ width: 640 }}
            >
                {providers.map((provider: any) => {
                    if(selectProviders.some((item: any) => item.id === provider.id)){
                        return <ProviderLocal provider={provider} checkedMain={true}/>
                    }else if(tempSelectedProviders.some((item: any) => item.id === provider.id)){
                        return <ProviderLocal provider={provider} checkedMain={false}/>
                    }
                })}
                <Divider/>
                <div className={classes.row}>
                    <div className={classes.priceTotalTitle}>Итоговая стоимость</div>
                    <div className={classes.priceTotal}>{fetch.length !== 0 ? <Skeleton width={"90px"} height={"27px"}/> : selectProviders.reduce((prev: any, current: any) => prev + (current.total_cost), 0).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
                </div>
                <div className={classes.row} style={{marginTop: 40}}>
                    {!isLoadingGetMyBalance ?
                        <div className={classes.balance}>
                            Баланс счета <span className={classes.balanceCount}>{myBalance ? (+myBalance?.balance).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency }): "0"}</span>
                        </div>:
                        <Skeleton width={"100px"} height={"35px"}/>
                    }
                    <Button
                        disabled={selectProviders.length === 0 || fetch.length !== 0}
                        label={"Оплатить заказ"}
                        className={classes.btnBuy}
                        loading={fetchCreateOrder}
                        onClick={()=>{
                            let totalCount = selectProviders.reduce((prev: any, current: any) => prev + (current.total_cost), 0)
                            let arrIndex = selectProviders.map((provider: any) => provider.id)
                            setFetchCreateOrder(true)
                            basketAPI.actionForSelectProductsInBasket(arrIndex, "order")
                                .then(response => {
                                    let tempProviders = providers.filter((provider: any) => {
                                        return arrIndex.indexOf(provider.id) === -1
                                    })
                                    setProviders([...tempProviders])
                                    setSelectProviders([])
                                    dispatch(userSlice.actions.updateMyBalance({balance: `${+(myBalance?.balance as string) - totalCount}`, freezed_amount: myBalance?.freezed_amount ? +myBalance?.freezed_amount + totalCount : totalCount}))
                                    toastRef?.current?.show({severity: 'success', summary: 'Заказ создан'})
                                    onHide()
                                })
                                .catch(error => {
                                    toastRef?.current?.show({severity: 'error', summary: 'Заказ не создан'})
                                })
                                .finally(()=>{
                                    setFetchCreateOrder(false)
                                })
                        }}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default ModalCreateOrder;