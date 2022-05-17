import React, {FC, useRef, useState} from 'react';
import classes from './Cabinet.module.scss'
import Header from "../../components/Header/Header";
import {NavLink, useNavigate, Outlet} from "react-router-dom";
import {ReactComponent as Account} from "../../assets/svg/Account.svg";
import {ReactComponent as NewsPaper} from "../../assets/svg/NewsPaper.svg";
import {ReactComponent as PlusSVG} from "../../assets/svg/Plus.svg";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import clsx from "clsx";
import {Toast} from "primereact/toast";
import {userSlice} from "../../redux/reducers/UserReducer/UserSlice";

const Cabinet: FC = () => {
    const user = useAppSelector(state => state.userReducer.userData)
    const isLoadingGetMyProviders = useAppSelector(state => state.userReducer.isLoadingGetMyProviders)
    const myProviders = useAppSelector(state => state.userReducer.myProviders)
    const toastRef = useRef<Toast>(null)
    const navigate = useNavigate()

    const newProvider = useAppSelector(state => state.userReducer.newProvider)
    const dispatch = useAppDispatch()

    return (
        <>
            <Header/>
            <div className={classes.container}>
                <div className={classes.title}>Личный кабинет</div>
                <div className={classes.cols}>
                    <div className={classes.sidebar}>
                        <div className={classes.nav}>
                            <NavLink
                                end
                                to={"/cabinet"}
                                className={({isActive})=> isActive ? clsx(classes.link, classes.linkActive): classes.link}
                            >
                                <Account/>
                                <span>{user?.name}</span>
                            </NavLink>
                            {!isLoadingGetMyProviders ?
                                <>
                                    {myProviders.map((provider)=>{
                                        return(
                                            <NavLink
                                                to={`/cabinet/${provider.id}`}
                                                className={({isActive})=> isActive ? clsx(classes.link, classes.linkActive): classes.link}
                                            >
                                                <NewsPaper/>
                                                {provider?.status ?
                                                    <div>
                                                        <span>{provider?.name}</span>
                                                        <span className={classes.status}>{provider?.status}</span>
                                                    </div>:
                                                    <span>{provider?.name}</span>
                                                }

                                            </NavLink>
                                        )
                                    })}
                                    {newProvider ?
                                        <NavLink
                                            to={`/cabinet/new`}
                                            className={({isActive})=> isActive ? clsx(classes.link, classes.linkActive): classes.link}
                                        >
                                            <NewsPaper/>
                                            <span>Новая площадка</span>
                                        </NavLink>:
                                        <div
                                            className={classes.btnAdd}
                                            onClick={()=>{
                                                dispatch(userSlice.actions.setNewProvider(true))
                                                navigate(`/cabinet/new`)
                                            }}
                                        >
                                            <PlusSVG/>
                                            <span>Добавить площадку</span>
                                        </div>
                                    }
                                </>:
                                <div className={classes.linksLoading}>
                                    <i className="pi pi-spin pi-spinner"/>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={classes.content}>
                        <Outlet context={toastRef}/>
                    </div>
                </div>
            </div>
            <Toast ref={toastRef} position="bottom-right"/>
        </>
    );
};

export default Cabinet;