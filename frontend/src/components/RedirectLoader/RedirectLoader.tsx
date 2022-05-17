import React, {FC} from 'react';
import classes from "./RedirectLoader.module.scss"

const RedirectLoader: FC = () => {
    return (
        <div className={classes.body}>
            <div className={classes.container}>
                <div className={classes.divider} aria-hidden="true"/>
                <p className={classes.loadingText} aria-label="Loading">
                    <span className={classes.letter} aria-hidden="true">L</span>
                    <span className={classes.letter} aria-hidden="true">o</span>
                    <span className={classes.letter} aria-hidden="true">a</span>
                    <span className={classes.letter} aria-hidden="true">d</span>
                    <span className={classes.letter} aria-hidden="true">i</span>
                    <span className={classes.letter} aria-hidden="true">n</span>
                    <span className={classes.letter} aria-hidden="true">g</span>
                </p>
            </div>
        </div>
    );
};

export default RedirectLoader;