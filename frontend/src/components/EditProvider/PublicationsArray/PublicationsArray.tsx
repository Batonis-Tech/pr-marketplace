import React, {FC} from 'react';
import classes from './PublicationsArray.module.scss'
import DropdownLs from "../DropdownLS/DropdownLS";
import InputNumberLs from "../InputNumberLS/InputNumberLS";
import {ReactComponent as CloseSVG} from "../../../assets/svg/Close.svg";
import InputTextLS from "../InputTextLS/InputTextLS";
import {Button} from "primereact/button";
import clsx from "clsx";
import {ReactComponent as PlusSVG} from "../../../assets/svg/Plus.svg";

const initialPublication = {
    type: null,
    price: null,
    options: []
}

const initialOption = {
    name: "",
    price: null
}

interface PublicationsArrayProps {
    publications: any[]
    setPublications: (value: any[] | ((prevVar: any[]) => any[])) => void
    isRequired?: boolean,
    setIsRequired?: (value: boolean) => void
}

const PublicationsArray: FC<PublicationsArrayProps> = ({publications, setPublications, isRequired, setIsRequired}) => {

    const setPublication = (publication: any, indexPub: number) => {
        let tempPublications: any[] = []
        publications.forEach((pub: any, inx: number)=>{
            if(inx === indexPub){
                tempPublications.push({...publication})
            }else{
                tempPublications.push({...pub})
            }
        })
        setPublications([...tempPublications])
    }

    const addPublication = () => {
        let tempPublications = [...publications]
        tempPublications.push({...initialPublication})
        setPublications([...tempPublications])
    }

    const deletePublication = (indexPub: number) => {
        let tempPublications = [...publications]
        tempPublications.splice(indexPub, 1)
        setPublications([...tempPublications])
    }

    const addOption = (publication: any, indexPub: number) => {
        let tempPublication = {...publication}
        tempPublication.options = [...tempPublication.options, {...initialOption}]
        setPublication({...tempPublication}, indexPub)
    }

    const deleteOption = (publication: any, indexPub: number, indexOpt: number) => {
        let tempPublication = {...publication}
        tempPublication.options.splice(indexOpt, 1)
        setPublication({...tempPublication}, indexPub)
    }

    const setPublicationType = (publication: any, indexPub: number, value: number | null) => {
        let tempPublication = {...publication}
        tempPublication.type = value
        setPublication({...tempPublication}, indexPub)
    }

    const setPublicationPrice = (publication: any, indexPub: number, value: number | null) => {
        let tempPublication = {...publication}
        tempPublication.price = value
        setPublication({...tempPublication}, indexPub)
    }

    const setOptionName = (publication: any, indexPub: number, option: any, indexOpt: number, value: string) => {
        let tempPublication = {...publication}
        let tempOption = {...option}
        tempOption.name = value
        tempPublication.options = tempPublication.options.map((opt: any, index: number) => indexOpt === index ? tempOption : opt)
        setPublication({...tempPublication}, indexPub)
    }

    const setOptionPrice = (publication: any, indexPub: number, option: any, indexOpt: number, value: number | null) => {
        let tempPublication = {...publication}
        let tempOption = {...option}
        tempOption.price = value
        tempPublication.options = tempPublication.options.map((opt: any, index: number) => indexOpt === index ? tempOption : opt)
        setPublication({...tempPublication}, indexPub)
    }

    return (
        <>
            <div className={classes.subTitle}>Форматы публикации</div>
            {publications.map((publication, indexPub) => {
                return(
                    <div key={`publication${indexPub}`} className={classes.pub}>
                        <div className={classes.grid}>
                            <DropdownLs isRequired={isRequired} setIsRequired={setIsRequired} value={publication.type} setValue={(value)=>setPublicationType(publication, indexPub, value)} required placeholder={"Выберите формат публикации"} label={"Формат публикации"} path={"products/types"}/>
                            <InputNumberLs isRequired={isRequired} setIsRequired={setIsRequired} value={publication.price} setValue={(value)=>setPublicationPrice(publication, indexPub, value)} required placeholder={"Укажите стоимость формата"} label={"Стоимость размещения, руб"}/>
                            {publications.length > 1 &&
                                <div className={classes.btnPublicationDel} onClick={()=>deletePublication(indexPub)}>
                                    <CloseSVG/>
                                </div>
                            }
                        </div>
                        <div className={classes.optionsInner}>
                            <div className={classes.optionsTitle}>Дополнительные услуги</div>
                            {publication?.options.map((option: any, indexOpt: number) => {
                                return(
                                    <div key={`options${indexPub}${indexOpt}`} className={classes.grid} style={{marginBottom: 16}}>
                                        <InputTextLS isRequired={isRequired} setIsRequired={setIsRequired} value={option.name} setValue={(value)=>setOptionName(publication, indexPub, option, indexOpt, value)} required placeholder={"Введите название услуги"} label={"Название услуги"}/>
                                        <InputNumberLs isRequired={isRequired} setIsRequired={setIsRequired} value={option.price} setValue={(value)=>setOptionPrice(publication, indexPub, option, indexOpt, value)} required placeholder={"Укажите стоимость услуги"} label={"Стоимость, руб"}/>
                                        <div className={classes.btnPublicationDel} onClick={() => deleteOption(publication, indexPub, indexOpt)}>
                                            <CloseSVG/>
                                        </div>
                                    </div>
                                )
                            })}

                            <Button
                                className={clsx(classes.btnOptionsAdd, "p-button-text")}
                                onClick={()=>addOption(publication, indexPub)}
                            >
                                <PlusSVG/>
                                <span>Добавить услугу</span>
                            </Button>
                        </div>
                    </div>
                )
            })}
            <Button
                className={clsx(classes.btnPublicationAdd, "p-button-text")}
                onClick={()=>addPublication()}
            >
                <PlusSVG/>
                <span>Добавить формат публикации</span>
            </Button>
        </>
    );
};

export default PublicationsArray;