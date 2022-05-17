import React, {FC} from 'react';
import classes from './Platform.module.scss'
import {ReactComponent as Document} from "../../assets/svg/Document.svg";
import {ReactComponent as Pen} from "../../assets/svg/Pen.svg";
import {Link} from "react-router-dom";
import {IPlatform} from "../../models/IPlatform";

interface PlatformProps {
    platform: IPlatform
}

const Platform: FC<PlatformProps> = ({platform}) => {
    return (
        <div className={classes.item}>
            <div className={classes.col1}>
                <div className={classes.info}>
                    <img src={platform.logo?.thumbnail_url ?? platform.logo?.image_url ?? undefined} className={classes.img} alt={"PlatformIcon"}/>
                    <Link to={`/platform/${platform.id}`} className={classes.link}>{platform.name}</Link>
                    <div className={classes.location}>{(platform.state && platform.state[0].name) ?? (platform.country && platform.country[0].name) ?? ""}</div>
                </div>
                <div className={classes.cards}>
                    {platform.themes && platform.themes.map(theme => {
                        return(
                            <div key={`card${theme.id}`} className={classes.card}>
                                {theme.name}
                            </div>
                        )
                    })}
                </div>
            </div>
            {platform.products &&
                <div className={classes.col2}>
                    <div className={classes.services}>
                        {platform.products.length > 0 &&
                            <div className={classes.service} style={{backgroundColor: "#FFF8E1"}}>
                                {/*<Document/>*/}
                                <span className={classes.serviceName}>{platform.products[0].type.name}</span>
                                <span className={classes.servicePrice}>{platform.products[0].price} ₽</span>
                            </div>
                        }
                        {platform.products.length > 1 &&
                            <div className={classes.service} style={{backgroundColor: "#F7F8F9"}}>
                                {/*<Pen/>*/}
                                <span className={classes.serviceName}>{platform.products[1].type.name}</span>
                                <span className={classes.servicePrice}>{platform.products[1].price} ₽</span>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default Platform;
