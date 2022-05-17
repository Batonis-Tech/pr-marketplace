import React, {FC} from 'react';
import classes from './Provider.module.scss'
import {IPlatform} from "../../models/IPlatform";
import {ReactComponent as ExternalLink} from "../../assets/svg/ExternalLink.svg";
import {IFilterValue} from "../../models/IFilterValue";
import {Skeleton} from "primereact/skeleton";

interface ProviderProps {
    platform?: IPlatform,
    fetch?: boolean
}

const Provider: FC<ProviderProps> = ({platform, fetch}) => {

    const region = (platform: IPlatform) => {
        let array: IFilterValue[] = []
        if(platform.country){
            array = [...array, ...platform.country]
        }
        if(platform.state){
            array = [...array, ...platform.state]
        }
        if(platform.city){
            array = [...array, ...platform.city]
        }
        return array.map(obj => obj.name).join(", ")
    }

    if(fetch){
        return (
            <>
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
            </>
        )
    }

    return (
        <>
            {(platform?.logo?.thumbnail_url || platform?.logo?.image_url) &&
                <img src={platform?.logo?.thumbnail_url ?? platform?.logo?.image_url ?? undefined} alt={"PlatformIcon"} className={classes.img}/>
            }
            <div className={classes.nameInner}>
                <div className={classes.name}>{platform?.name}</div>
                <a href={platform?.url ?? ""} target={"_blank"}>
                    <ExternalLink/>
                </a>
            </div>
            <div className={classes.location}>
                {region(platform as IPlatform)}
            </div>
            <div className={classes.cards}>
                {platform?.themes && platform.themes.map(theme => {
                    return(
                        <div key={`themes${theme.id}`} className={classes.card}>
                            {theme.name}
                        </div>
                    )
                })}
            </div>
            {platform?.description &&
                <div dangerouslySetInnerHTML={{__html: (platform as IPlatform)?.description ?? ""}}/>
            }
            <div className={classes.valuesInner}>
                <div className={classes.valueRow}>
                    <div className={classes.valueTitle}>Тип площадки</div>
                    <div className={classes.valueText}>{platform?.types ? platform.types[0].name: "Не указано"}</div>
                </div>
                <div className={classes.valueRow}>
                    <div className={classes.valueTitle}>Скорость размещения</div>
                    <div className={classes.valueText}>{platform?.days_to_prod} день</div>
                </div>
                <div className={classes.valueRow}>
                    <div className={classes.valueTitle}>Трафик</div>
                    <div className={classes.valueText}>{platform?.index_traffic} тыс</div>
                </div>
                <div className={classes.valueRow}>
                    <div className={classes.valueTitle}>Траст чектраст</div>
                    <div className={classes.valueText}>{platform?.index_trust_checktrust}</div>
                </div>
            </div>
        </>
    );
};

export default Provider;