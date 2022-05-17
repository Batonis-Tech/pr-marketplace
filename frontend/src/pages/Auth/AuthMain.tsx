import React, {FC} from 'react';
import classes from "./AuthMain.module.scss";
import { TabView, TabPanel } from 'primereact/tabview';
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import ResetPassword from "./ResetPassword/ResetPassword";
import CreatePassword from "./CreatePassword/CreatePassword";
import ConfirmSignUp from "./ConfirmSignUp/ConfirmSignUp";

const AuthMain: FC = () => {
    return (
        <div
            className={classes.container}
        >
            <TabView
                className={classes.tabView}
            >
                <TabPanel
                    className={classes.tabPanel}
                    headerClassName={classes.tabPanelHeader}
                    contentClassName={classes.tabPanelContent}
                    header="Вход"
                >
                    <Login/>
                </TabPanel>
                <TabPanel
                    className={classes.tabPanel}
                    headerClassName={classes.tabPanelHeader}
                    contentClassName={classes.tabPanelContent}
                    header="Регистрация"
                >
                    <SignUp/>
                </TabPanel>
            </TabView>
            {/*<ConfirmSignUp/>*/}
            {/*<CreatePassword/>*/}
            {/*<ResetPassword/>*/}
        </div>
    );
};

export default AuthMain;
