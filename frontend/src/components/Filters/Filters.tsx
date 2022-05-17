import React, {FC, useState} from 'react';
import classes from "./Filters.module.scss";
import { Accordion, AccordionTab } from 'primereact/accordion';
import {Button} from "primereact/button";
import clsx from "clsx";
import DropdownLazy from "./DropdownLazy/DropdownLazy";
import MultiSelectLazy from "./MultiSelectLazy/MultiSelectLazy";
import TwoInputs from "./TwoInputs/TwoInputs";
import OneInput from "./OneInput/OneInput";
import DropdownBoolean from "./DropdownBoolean/DropdownBoolean";
import DropdownRange from "./DropdownRange/DropdownRange";
import {useAppDispatch, useAppSelector} from "../../hooks/reduxHooks";
import {filtersSlice} from "../../redux/reducers/FiltersReducer/FiltersSlice";
import MultiSelectRange from "./MultiSelectRange/MultiSelectRange";
import CheckboxesLazy from "./CheckboxesLazy/CheckboxesLazy";
import ChipsFilter from "./ChipsFilter/ChipsFilter";
import {getPlatforms} from "../../redux/reducers/CatalogReducer/CatalogActionCreators";

const Filters: FC = () => {

    const activeIndex = useAppSelector(state => state.filtersReducer.showAccordions)

    const dispatch = useAppDispatch()

    const mainHeader = (
        <div className={classes.mainHeaderInner}>
            <div className={classes.mainHeaderTitle}>Фильтры</div>
        </div>
    )

    return (
        <div className={classes.container}>
            <Button label={"Сбросить"} onClick={()=> {
                dispatch(filtersSlice.actions.resetFilters())
                dispatch(getPlatforms("page=1&page_size=10"))
            }} className={clsx("p-button-text", classes.btnDrop)}/>
            <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => dispatch(filtersSlice.actions.setShowAccordions(e.index))}>
                <AccordionTab header={mainHeader} contentClassName={classes.accordionTabContent}>
                    <MultiSelectLazy filterName={"themes"} placeholder={"Выберите тематику"} label={"Тематика"} path={"providers/themes"}/>
                    <MultiSelectLazy filterName={"announsment"} placeholder={"Все"} label={"Анонс"} path={"providers/announcements"}/>
                    <TwoInputs label={"Цена размещения"} filterNameMin={"price_min"} filterNameMax={"price_max"}/>
                    <OneInput filterName={"index_traffic_min"} label={"Трафик в месяц, тыс"} placeholder={"От"}/>
                </AccordionTab>
                <AccordionTab header="Регион" contentClassName={classes.accordionTabContent}>
                    <MultiSelectLazy filterName={"domains"} placeholder={"Все"} label={"Домен"} path={"providers/domains"} />
                    <MultiSelectLazy filterName={"country"} placeholder={"Все"} label={"Страна"} path={"geo/countries"}/>
                    <MultiSelectLazy filterName={"state"} placeholder={"Все"} label={"Регион"} path={"geo/states"}/>
                    <MultiSelectLazy filterName={"city"} placeholder={"Все"} label={"Город"} path={"geo/cities"}/>
                </AccordionTab>
                <AccordionTab header="Размещение" contentClassName={classes.accordionTabContent}>
                    <MultiSelectLazy filterName={"pub_format"} placeholder={"Все"} label={"Формат размещения"} path={"products/types"}/>
                    <OneInput filterName={"days_to_prod"} label={"Скорость размещения, дней"} placeholder={"До"}/>
                    <OneInput filterName={"links"} label={"Количество ссылок в публикации"} placeholder={"Любое"}/>
                </AccordionTab>
                <AccordionTab header="Параметры площадки" contentClassName={classes.accordionTabContent}>
                    <MultiSelectLazy filterName={"types"} placeholder={"Все"} label={"Тип сайта"} path={"providers/types"}/>
                    <MultiSelectLazy filterName={"allowed_publication_themes"} placeholder={"Все"} label={"Работает с тематикой"} path={"providers/pub_themes"}/>
                    <OneInput filterName={"month_old"} label={"Возраст сайта, мес"} placeholder={"От"}/>
                    <MultiSelectLazy filterName={"languages"} placeholder={"Любой"} label={"Язык сайта"} path={"geo/languages"}/>
                    <DropdownBoolean filterName={"finded_link_exchange"} placeholder={"Не важно"} label={"Обнаружена на бирже ссылок"}/>
                    <DropdownBoolean filterName={"advertising_mark"} placeholder={"Не важно"} label={"Отметка рекламы"}/>
                    <CheckboxesLazy/>
                </AccordionTab>
                <AccordionTab header="Индексация сайта" contentClassName={classes.accordionTabContent}>
                    <TwoInputs label={"Индекс Яндекс"} filterNameMin={"index_yandex_min"} filterNameMax={"index_yandex_max"}/>
                    <TwoInputs label={"Индекс Google"} filterNameMin={"index_google_min"} filterNameMax={"index_google_max"}/>
                    <DropdownBoolean filterName={"yandex_news"} placeholder={"Не важно"} label={"в Яндекс.Новости"}/>
                    <DropdownBoolean filterName={"google_news"} placeholder={"Не важно"} label={"в Google Новости"}/>
                </AccordionTab>
                <AccordionTab header="Спам/чектраст" contentClassName={classes.accordionTabContent}>
                    <TwoInputs label={"Траст чектраст"} filterNameMin={"index_trust_checktrust_min"} filterNameMax={"index_trust_checktrust_max"}/>
                    <TwoInputs label={"Домены-доноры"} filterNameMin={"index_domain_donors_min"} filterNameMax={"index_domain_donors_max"}/>
                    <TwoInputs label={"Спам чектраст"} filterNameMin={"index_spam_checktrust_min"} filterNameMax={"index_spam_checktrust_max"}/>
                    <ChipsFilter label={"Ключевые слова"}/>
                    <TwoInputs label={"ИКС"} filterNameMin={"index_IKS_min"} filterNameMax={"index_IKS_max"}/>
                    <TwoInputs label={"Органический трафик"} filterNameMin={"index_organic_traffic_min"} filterNameMax={"index_organic_traffic_max"}/>
                    <TwoInputs label={"CF"} filterNameMin={"index_CF_min"} filterNameMax={"index_CF_max"}/>
                    <TwoInputs label={"TF"} filterNameMin={"index_TF_min"} filterNameMax={"index_TF_max"}/>
                    <TwoInputs label={"TR"} filterNameMin={"index_TR_min"} filterNameMax={"index_TR_max"}/>
                    <TwoInputs label={"DR"} filterNameMin={"index_DR_min"} filterNameMax={"index_DR_max"}/>
                    <TwoInputs label={"Alexa Rank"} filterNameMin={"index_alexa_rank_min"} filterNameMax={"index_alexa_rank_max"}/>
                    <TwoInputs label={"Da Moz"} filterNameMin={"index_da_moz_min"} filterNameMax={"index_da_moz_max"}/>
                    <TwoInputs label={"Рейтинг Ahrefs"} filterNameMin={"index_a_hrefs_min"} filterNameMax={"index_a_hrefs_max"}/>
                    <TwoInputs label={"Бэклинки"} filterNameMin={"index_backlinks_min"} filterNameMax={"index_backlinks_max"}/>
                </AccordionTab>
            </Accordion>
        </div>
    );
};

export default Filters;
