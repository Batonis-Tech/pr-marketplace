import React, {FC, useEffect} from 'react';
import {useParams, useSearchParams} from "react-router-dom";
import {userAPI} from "../../../api/api";
import {useAppDispatch} from "../../../hooks/reduxHooks";
import {getUserData} from "../../../redux/reducers/UserReducer/UserActionCreators";

const ConfirmEmailMiddleware: FC = () => {
    const [searchParas, setSearchParams] = useSearchParams()

    const dispatch = useAppDispatch()

    useEffect(()=>{
        userAPI.ConfirmTokenSignUp(searchParas.get("token") ?? "")
            .then(response =>{
                dispatch(getUserData())
            })
            .catch(error => {

            })
    },[])
    return (
        <div>

        </div>
    );
};

export default ConfirmEmailMiddleware;