import React, {FC, RefObject, useEffect, useState} from 'react';
import classes from './EditProvider.module.scss'
import PublicationsArray from "./PublicationsArray/PublicationsArray";
import {IProduct} from "../../models/IProduct";
import UploadLogoProvider from "./UploadLogoProvider/UploadLogoProvider";
import InputTextLS from "./InputTextLS/InputTextLS";
import MultiSelectLazyLs from "./MultiSelectLazyLS/MultiSelectLazyLS";
import EditDescriptionLs from "./EditDescriptionLS/EditDescriptionLS";
import MultiSelectLocation from "./MultiSelectLocation/MultiSelectLocation";
import MultiSelectLazyLS from "./MultiSelectLazyLS/MultiSelectLazyLS";
import {Button} from "primereact/button";
import clsx from "clsx";
import {Toast} from "primereact/toast";
import InputNumberLs from "./InputNumberLS/InputNumberLS";
import CheckboxLs from "./CheckboxLS/CheckboxLS";
import CheckboxesLazyLs from "./CheckboxesLazyLS/CheckboxesLazyLS";
import DropdownLs from "./DropdownLS/DropdownLS";
import {IPlatform} from "../../models/IPlatform";
import DatePickerLs from "./DatePickerLS/DatePickerLS";
import {cabinetAPI} from "../../api/api";
import {useAppDispatch} from "../../hooks/reduxHooks";
import {getMyAccount} from "../../redux/reducers/UserReducer/UserActionCreators";
import {useNavigate} from "react-router-dom";
import {userSlice} from "../../redux/reducers/UserReducer/UserSlice";
import {convertDateToStringForBackend} from "../../services/convertDateToStringForBackend";

const initialPublication = {
    type: null,
    price: null,
    options: []
}

interface EditProviderProps {
    setEdit: (value: boolean) => void,
    toastRef?: RefObject<Toast>,
    platform?: IPlatform,
    refetch?: () => void
}

const EditProvider: FC<EditProviderProps> = ({setEdit, toastRef, platform, refetch}) => {
    const [publications, setPublications] = useState<any[]>([{...initialPublication}])
    const [url, setUrl] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [logo, setLogo] = useState<{image_url: string, id: number | null}>({image_url: "", id: null})
    const [birthday, setBirthday] = useState<Date | Date[] | undefined>(undefined) // "2022-10-10"
    const [description, setDescription] = useState({html: "", delta: ""})
    const [country, setCountry] = useState<number[] | null>(null)
    const [state, setState] = useState<number[] | null>(null)
    const [city, setCity] = useState<number[] | null>(null)
    const [languages, setLanguages] = useState<number[] | null>(null)
    const [themes, setThemes] = useState<number[] | null>(null)
    const [types, setTypes] = useState<number[] | null>(null)
    const [domains, setDomains] = useState<number[] | null>(null)
    const [aggregators, setAggregators] = useState<number[]>([])
    const [allowed_publication_themes, setAllowed_publication_themes] = useState<number[] | null>(null)
    const [writing, setWriting] = useState<boolean>(false)
    const [advertising_mark, setAdvertising_mark] = useState<boolean>(false)
    const [days_to_prod, setDays_to_prod] = useState<number | null>(null)
    const [links, setLinks] = useState<number | null>(null)
    const [announsment, setAnnounsment] = useState<number | null>(null)

    const [fetchSave, setFetchSave] = useState<boolean>(false)

    const [isRequired, setIsRequired] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    useEffect(()=>{
        if(platform){
            setName(platform?.name ?? "")
            setUrl(platform?.url ?? "")
            setLogo({image_url: platform.logo?.image_url ?? "", id: platform.logo?.id ?? null})
            setThemes(platform?.themes?.map(item => item.id) ?? [])
            setDescription({html: platform?.description ?? "", delta: ""})
            setDomains(platform?.domains?.map(item => item.id) ?? [])
            setCountry(platform?.country?.map(item => item.id) ?? [])
            setState(platform?.state?.map(item => item.id) ?? [])
            setCity(platform?.city?.map(item => item.id) ?? [])
            setTypes(platform?.types?.map(item => item.id) ?? [])
            setAllowed_publication_themes(platform?.allowed_publication_themes?.map(item => item.id) ?? [])
            setBirthday(platform?.birthday ? new Date(platform?.birthday) : undefined)
            setLanguages(platform?.languages?.map(item => item.id) ?? [])
            setAggregators(platform?.aggregators?.map(item => item.id) ?? [])
            setAdvertising_mark(platform?.advertising_mark ?? false)
            setWriting(platform?.writing ?? false)
            setDays_to_prod(platform?.days_to_prod ?? null)
            setLinks(platform?.links ?? null)
            setAnnounsment(platform?.announsment ?? null)
            if(platform?.products && platform?.products?.length > 0){
                setPublications(platform?.products?.map(prod => ({type: prod.type.id, price: prod.price ? +prod.price : null, options: prod.options.map(opt => ({name: opt.name, price: opt.price ? +opt.price : null}))})))
            }else{
                setPublications([{...initialPublication}])
            }
        }
    }, [])

    const save = () => {
        setFetchSave(true)
        let tempProvider: any = {}

        if(name !== "") {
            tempProvider["name"] = name
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(logo.id){
            tempProvider["logo"] = `${logo.id}`
        }

        if(url !== "") {
            tempProvider["url"] = url
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(birthday) {
            tempProvider["birthday"] = convertDateToStringForBackend(birthday as Date)
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(description.html !== "") tempProvider["description"] = JSON.stringify(description)

        if(country && country.length > 0) {
            tempProvider["country"] = country
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(state && state.length > 0)  tempProvider["state"] = state
        if(city && city.length > 0)  tempProvider["city"] = city

        if(languages && languages.length > 0) {
            tempProvider["languages"] = languages
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(themes && themes.length > 0) {
            tempProvider["themes"] = themes
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(types && types.length > 0) {
            tempProvider["types"] = types
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(domains && domains.length > 0) {
            tempProvider["domains"] = domains
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(aggregators && aggregators.length > 0)  tempProvider["aggregators"] = aggregators
        if(allowed_publication_themes && allowed_publication_themes.length > 0)  tempProvider["allowed_publication_themes"] = allowed_publication_themes
        tempProvider["writing"] = writing
        tempProvider["advertising_mark"] = advertising_mark
        if(days_to_prod) tempProvider["days_to_prod"] = days_to_prod

        if(links) {
            tempProvider["links"] = links
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        let reqForPublications = false
        publications.forEach(pub => {
            if(pub.price === null || pub.type === undefined){
                reqForPublications = true
            }
            pub.options.forEach((opt: any) =>{
                if(opt.price === null || opt.name === ""){
                    reqForPublications = true
                }
            })
        })
        console.log(reqForPublications)
        if(!reqForPublications) {
            tempProvider["products"] = publications
        }else{
            setIsRequired(true)
            setFetchSave(false)
            toastRef?.current?.show({severity: 'error', summary: 'Заполните все необходимые поля'})
            return null
        }

        if(platform){
            cabinetAPI.editProvider(platform?.id as number, tempProvider)
                .then(response => {
                    toastRef?.current?.show({severity: 'success', summary: 'Информация была сохранена'})
                    if(refetch) refetch()
                    dispatch(getMyAccount)
                    setEdit(false)
                })
                .catch(error => {

                })
                .finally(()=>{
                    setFetchSave(false)
                })
        }else{
            cabinetAPI.createProvider(tempProvider)
                .then(response => {
                    toastRef?.current?.show({severity: 'success', summary: 'Информация была сохранена'})
                    dispatch(getMyAccount)
                    dispatch(userSlice.actions.setNewProvider(false))
                    navigate('/cabinet')
                })
                .catch(error => {
                    if(error.response.data?.url){
                        toastRef?.current?.show({severity: 'error', summary: 'Неправильная ссылка на сайт'})
                    }
                })
                .finally(()=>{
                    setFetchSave(false)
                })
        }
    }

    return (
        <div className={classes.content}>
            <div>
                <div className={classes.gridFirst}>
                    <UploadLogoProvider logo={logo} setLogo={value => setLogo(value)}/>
                    <div>
                        <InputTextLS isRequired={isRequired} setIsRequired={setIsRequired} value={name} setValue={setName} styleInner={{marginBottom: 24}} required label={"Название"} placeholder={"Введите название площадки"}/>
                        <InputTextLS isRequired={isRequired} setIsRequired={setIsRequired} value={url} setValue={setUrl} required label={"Ссылка на сайт"} placeholder={"Добавьте ссылку на площадку"}/>
                    </div>
                </div>
                <MultiSelectLazyLs isRequired={isRequired} setIsRequired={setIsRequired} value={themes} setValue={setThemes} required path={"providers/themes"} label={"Тематики"} placeholder={"Выберите тематики"}/>
                <EditDescriptionLs value={description} setValue={setDescription}/>
                <div className={classes.subTitle}>Регион</div>
                <div className={classes.grid}>
                    <MultiSelectLazyLS isRequired={isRequired} setIsRequired={setIsRequired} value={domains} setValue={setDomains} required placeholder={"Выберите домен "} label={"Домен"} path={"providers/domains"}/>
                    <MultiSelectLocation isRequired={isRequired} setIsRequired={setIsRequired} country={country} setCountry={setCountry} state={state} setState={setState} city={city} setCity={setCity}/>
                </div>
                <div className={classes.subTitle}>Параметры площадки</div>
                <div className={classes.grid}>
                    <MultiSelectLazyLS isRequired={isRequired} setIsRequired={setIsRequired} value={types} setValue={setTypes} required placeholder={"Выберите тип сайта"} label={"Тип сайта"} path={"providers/types"}/>
                    <MultiSelectLazyLS value={allowed_publication_themes} setValue={setAllowed_publication_themes} placeholder={"Выберите тематики"} label={"Работает с тематикой"} path={"providers/pub_themes"}/>
                    <DatePickerLs isRequired={isRequired} setIsRequired={setIsRequired} required value={birthday} setValue={setBirthday} label={"Дата создания сайта"} placeholder={"Выберите дату создания"}/>
                    <MultiSelectLazyLs isRequired={isRequired} setIsRequired={setIsRequired} value={languages} setValue={setLanguages} required placeholder={"Выберите язык сайта"} label={"Язык сайта"} path={"geo/languages"}/>
                </div>
                <div className={classes.gridSecond}>
                    <CheckboxesLazyLs values={aggregators} setValues={setAggregators}/>
                    <CheckboxLs value={advertising_mark} setValue={setAdvertising_mark} id={"advertising_mark"} label={"У публикации будет отметка о рекламе"}/>
                    <CheckboxLs value={writing} setValue={setWriting} id={"writing"} label={"У площадки можно заказать написание публикации"}/>
                </div>
                <div className={classes.subTitle}>Размещение</div>
                <div className={classes.grid}>
                    <InputNumberLs value={days_to_prod} setValue={setDays_to_prod} label={"Скорость размещения, дней"} placeholder={"Введите количество дней"}/>
                    <InputNumberLs isRequired={isRequired} setIsRequired={setIsRequired} value={links} setValue={setLinks} required label={"Количество ссылок в публикации"} placeholder={"Введите допустимое количество ссылок"}/>
                    <DropdownLs value={announsment} setValue={setAnnounsment} placeholder={"Выберите доступные анонсы"} label={"Анонсы"} path={"providers/announcements"}/>
                </div>
                <PublicationsArray isRequired={isRequired} setIsRequired={setIsRequired} publications={publications} setPublications={setPublications}/>
            </div>
            <div className={classes.bottomBar}>
                <Button
                    className={clsx("p-button-text", classes.bottomBarBtn)}
                    label={"Отменить"}
                    disabled={fetchSave}
                    onClick={()=>{
                        setEdit(false)
                    }}
                />
                <Button
                    className={classes.bottomBarBtn}
                    label={"Сохранить и отправить на модерацию"}
                    loading={fetchSave}
                    onClick={save}
                />
            </div>
        </div>
    );
};

export default EditProvider;