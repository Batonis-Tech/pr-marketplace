import React, {FC, useState} from 'react';
import classes from './EditDescriptionLS.module.scss'
import {Editor} from "primereact/editor";

interface EditDescriptionLSProps {
    value?: any,
    setValue?: (value: any) => void
}

const EditDescriptionLs: FC<EditDescriptionLSProps> = ({value, setValue}) => {

    //todo
    const [objForServer, setObjForServer] = useState<any>({html: "", delta: ""})

    return (
        <div style={{marginTop: 32}}>
            <div className={classes.label}>Описание</div>
            <Editor style={{height:'260px'}} value={value?.html ?? objForServer.html} onTextChange={(e) => {
                if(setValue){
                    setValue({html: e.htmlValue, delta: e.source})
                }else{
                    setObjForServer({html: e.htmlValue, delta: e.source})
                }
            }} />
        </div>
    );
};

export default EditDescriptionLs;