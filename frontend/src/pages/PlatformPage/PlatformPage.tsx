import React, {FC, RefObject, useRef, useState} from 'react';
import classes from './PlatformPage.module.scss'
import Header from "../../components/Header/Header";
import {ReactComponent as ExternalLink} from "../../assets/svg/ExternalLink.svg";
import {Button} from "primereact/button";
import {ReactComponent as Basket} from "../../assets/svg/Basket.svg";
import clsx from "clsx";
import {RadioButton} from "primereact/radiobutton";
import {Card} from "primereact/card";
import {NavLink, useParams} from "react-router-dom";
import {platformPageAPI} from "../../redux/services/PlatformPageService";
import {Skeleton} from "primereact/skeleton";
import basket from "../Basket/Basket";
import {IBasketItem, IBasketItemForLS} from "../../models/IBasketItem";
import {useAppSelector} from "../../hooks/reduxHooks";
import {Toast, ToastProps} from "primereact/toast";
import {basketAPI} from "../../api/api";
import {IFilterValue} from "../../models/IFilterValue";
import {IPlatform} from "../../models/IPlatform";
import Provider from "../../components/Provider/Provider";

const PlatformPage: FC = () => {
    const [radiobutton, setRadiobutton] = useState(null)
    const [basket, setBasket] = useState<IBasketItemForLS[]>(localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket") as string) : [])
    const {platformId} = useParams()

    const [fetchAdd, setFetchAdd] = useState(false)

    const toastRef = useRef<Toast>(null)

    const {data: platform, isFetching, error} = platformPageAPI.useFetchPlatformPageQuery(platformId)
    const user = useAppSelector(state => state.userReducer.userData)
    /*const checkProductInBasket = () => {
        let result = false
        if(radiobutton){
            basket.forEach(product => {
                if(product.product === +radiobutton){
                    result = true
                }
            })
        }
        return result
    }*/

    const addProductInCart = () => {
        if(platform?.products){
            setFetchAdd(true)
            let tempBasket = [...basket]
            const tempSelectIdProduct = radiobutton ? +radiobutton : 0
            let tempItem = {product: tempSelectIdProduct, options: []}
            tempBasket.push(tempItem)
            basketAPI.addProductInBasket(tempItem)
                .then(response => {
                    localStorage.setItem("basket", JSON.stringify([...tempBasket]))
                    setBasket([...tempBasket])
                    toastRef?.current?.show({severity: 'success', summary: 'Заказ добавлен в список покупок'});
                    setFetchAdd(false)
                })
                .catch(error => {
                    toastRef?.current?.show({severity: 'error', summary: 'Заказ не был добавлен в список покупок'});
                    setFetchAdd(false)
                })
        }
    }

    const cardFooter = (
        <>
            {/*<Button label={"Заказать"} className={classes.sidebarBtn} />*/}
            <Button
                className={clsx("p-button-text", classes.sidebarBtn)}
                disabled={isFetching || radiobutton === null}
                loading={fetchAdd}
                onClick={addProductInCart}
            >
                <Basket style={{marginLeft: fetchAdd ? 8 : 0}} width={24} height={24}/>
                <span style={{marginLeft: 8}}>Добавить в список покупок </span>
            </Button>
        </>
    )

    const Loader = () => {
        return(
            <div>
                <Skeleton width={"350px"} height={"30px"} className={classes.skeletonBar}/>
                <div className={classes.colInner}>
                    <div className={classes.col1}>
                        <Skeleton width={"226px"} height={"80px"} className={classes.img}/>
                        <Skeleton width={"300px"} height={"30px"} className={classes.nameInner}/>
                        <Skeleton width={"500px"} className={classes.nameInner}/>
                        <Skeleton width={"500px"} height={"30px"} className={classes.nameInner}/>
                        <Skeleton width={"100%"} height={"60px"} className={classes.nameInner}/>
                        <Skeleton width={"100%"} height={"60px"} className={classes.nameInner}/>
                        <Skeleton width={"100%"} height={"60px"} className={classes.nameInner}/>
                        <div className={classes.valuesInner}>
                            <div className={classes.valueRow}>
                                <Skeleton width={"45%"} className={classes.valueTitle}/>
                                <Skeleton width={"45%"} className={classes.valueText}/>
                            </div>
                            <div className={classes.valueRow}>
                                <Skeleton width={"45%"} className={classes.valueTitle}/>
                                <Skeleton width={"45%"} className={classes.valueText}/>
                            </div>
                            <div className={classes.valueRow}>
                                <Skeleton width={"45%"} className={classes.valueTitle}/>
                                <Skeleton width={"45%"} className={classes.valueText}/>
                            </div>
                            <div className={classes.valueRow}>
                                <Skeleton width={"45%"} className={classes.valueTitle}/>
                                <Skeleton width={"45%"} className={classes.valueText}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.col2}>
                        <Skeleton width={"100%"} height={"400px"} className={classes.sidebar}/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Header/>
            <div className={classes.container}>
                {platform && !isFetching ?
                    <>
                        <div className={classes.bar}><NavLink to={"/"}>Каталог площадок</NavLink><span className={classes.hr}>\</span><span className={classes.barActive}>{platform.name}</span></div>
                        <div className={classes.colInner}>
                            <div className={classes.col1}>
                                <Provider platform={platform}/>
                            </div>
                            <div className={classes.col2}>
                                <Card className={classes.sidebar} title={"Заказать"} footer={cardFooter}>
                                    {platform.products && platform.products.map(product => {
                                        return(
                                            <div key={`product${product.id}`} className={classes.radioButtonInner}>
                                                <RadioButton inputId={`${product.id}`}  value={`${product.id}`} onChange={(e) => setRadiobutton(e.value)} checked={radiobutton === `${product.id}`} />
                                                <label htmlFor={`${product.id}`}>{product.type.name} <span>{product.price} ₽</span></label>
                                            </div>
                                        )
                                    })}
                                </Card>
                            </div>
                        </div>
                    </>:
                    <Loader/>
                }
            </div>
            <Toast ref={toastRef} position="bottom-right"/>
        </>
    );
};

export default PlatformPage;
