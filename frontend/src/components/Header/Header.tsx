import React, {FC, useEffect, useRef, useState} from 'react';
import classes from "./Header.module.scss"
import { Badge } from 'primereact/badge';
import {ReactComponent as Logo} from "../../assets/svg/LogoNew.svg";
import {ReactComponent as Basket} from "../../assets/svg/Basket.svg";
import {ReactComponent as Account} from "../../assets/svg/Account.svg";
import {ReactComponent as ArrowDown} from "../../assets/svg/DownArrow.svg";
import {ReactComponent as NewsPaper} from "../../assets/svg/NewsPaper.svg";
import {Link, NavLink} from "react-router-dom";
import clsx from "clsx";
import {useOnClickOutside} from "usehooks-ts";
import {userAPI} from "../../api/api";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import {userSlice} from "../../redux/reducers/UserReducer/UserSlice";
import {Skeleton} from "primereact/skeleton";

const Header: FC = () => {
    const [users, setUsers] = useState([
        {name: "Мария", id: 1, type: "user"},
        {name: "Forbes", id: 2, type: "company"},
        {name: "National Geographic", type: "company", id: 3},
    ])
    const [activeUser, setActiveUser] = useState({name: "Мария", id: 1, type: "user"})
    const [showDropdownMenu, setShowDropdownMenu] = useState(false)

    const refDropdownMenu = useRef(null)

    const handleClickOutside = () => {
        setShowDropdownMenu(false)
    }

    const user = useAppSelector(state => state.userReducer.userData)
    const isLoadingGetMyProviders = useAppSelector(state => state.userReducer.isLoadingGetMyProviders)
    const myProviders = useAppSelector(state => state.userReducer.myProviders)
    const currentAccount = useAppSelector(state => state.userReducer.currentAccount)
    const myBalance = useAppSelector(state => state.userReducer.myBalance)
    const isLoadingGetMyBalance = useAppSelector(state => state.userReducer.isLoadingGetMyBalance)

    const dispatch = useAppDispatch()

    useOnClickOutside(refDropdownMenu, handleClickOutside)

    useEffect(()=>{

    },[])

    return (
        <header className={classes.header}>
             <div className={classes.container}>
                 <NavLink
                     to={"/"}
                     className={({isActive})=> isActive ? clsx(classes.LogoLink, classes.linkActive): classes.LogoLink}
                 >
                     <Logo/>
                 </NavLink>
                 <div className={classes.nav}>
                     {currentAccount.role === "user" ?
                        <>
                            <NavLink
                                to={"/"}
                                className={({isActive})=> isActive ? clsx(classes.link, classes.linkActive): classes.link}
                            >Каталог площадок</NavLink>
                            <NavLink
                                to={"/orders"}
                                className={({isActive})=> isActive ? clsx(classes.link, classes.linkActive): classes.link}
                            >Мои заказы</NavLink>
                        </>:
                        <>
                            <NavLink
                                to={"/"}
                                className={({isActive})=> isActive ? clsx(classes.link, classes.linkActive): classes.link}
                            >Заказы</NavLink>
                        </>
                     }

                 </div>
                 <div className={classes.userInfo}>
                     {currentAccount.role === "user" &&
                         <NavLink
                             className={({isActive})=> isActive ? clsx(classes.basket, classes.linkActive): classes.basket}
                             to={'/basket'}
                         >
                             <Basket/>
                             {localStorage.getItem("basket") &&
                                <div className={classes.basketCount}>{localStorage.getItem("basket") ? JSON.parse(localStorage.getItem("basket") as string).length: 0}</div>
                             }
                         </NavLink>
                     }
                     {!isLoadingGetMyBalance ?
                         <NavLink
                             to={`/wallet?account=${myBalance ? myBalance.id : ""}`}
                             className={({isActive})=> isActive ? clsx(classes.balance, classes.balanceActive): classes.balance}
                         >
                             Счет <span className={classes.balanceCount}>{myBalance?.balance ? (+myBalance.balance).toLocaleString('ru-RU', { style: 'currency', currency: myBalance?.balance_currency }): "0 ₽"}</span>
                         </NavLink>:
                         <Skeleton width={"100px"} height={"35px"}/>
                     }

                     <div className={classes.userNameContainer}>
                         <NavLink
                             to={"/cabinet"}
                             className={({isActive})=> isActive ? clsx(classes.avatar, classes.balanceActive): classes.avatar}
                         >
                             {currentAccount.role === "user" ?
                                 <Account/>:
                                 <NewsPaper/>
                             }
                         </NavLink>
                         <div className={clsx(classes.userNameInner, showDropdownMenu && classes.userNameInnerActive)} onClick={()=>{setShowDropdownMenu(true)}}>
                             <div className={classes.userName}>{currentAccount.role === "user" ? user?.name : currentAccount?.data?.name}</div>
                             <ArrowDown/>
                         </div>
                         {showDropdownMenu &&
                             <div ref={refDropdownMenu} className={classes.dropdownMenu}>
                                 <div
                                     className={clsx(classes.dropdownMenuItem, currentAccount.role === "user" && classes.dropdownMenuItemActive)}
                                     onClick={()=>{
                                         if(currentAccount.role !== "user"){
                                             dispatch(userSlice.actions.setCurrentAccount({role: "user", data: null}))
                                             localStorage.removeItem("account")
                                             setShowDropdownMenu(false)
                                         }
                                     }}
                                 >
                                         <Account fill={"#FF6F00"}/>
                                     <div className={classes.userName}>{user?.name}</div>
                                 </div>
                                 {!isLoadingGetMyProviders ?
                                     <>
                                         {myProviders.map(provider => {
                                             return(
                                                 <div
                                                     className={clsx(classes.dropdownMenuItem, currentAccount.data?.id === provider.id && classes.dropdownMenuItemActive)}
                                                     onClick={()=>{
                                                         if(currentAccount.data?.id !== provider.id){
                                                             dispatch(userSlice.actions.setCurrentAccount({role: "platform", data: {...provider}}))
                                                             localStorage.setItem("account", `${provider.id}`)
                                                             setShowDropdownMenu(false)
                                                         }
                                                     }}
                                                 >
                                                     <NewsPaper/>
                                                     <div className={classes.userName}>{provider.name}</div>
                                                 </div>
                                             )
                                         })}
                                     </> :
                                     <div className={classes.dropdownMenuItem}>
                                         <i className="pi pi-spin pi-spinner"/>
                                     </div>
                                 }
                             </div>
                         }
                     </div>
                 </div>
             </div>
        </header>
    );
};

export default Header;
