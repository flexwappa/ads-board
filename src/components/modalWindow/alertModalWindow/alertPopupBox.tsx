import React from 'react';
import "./alertPopupBoxStyles.css"
import Button from "../../button/button";

export type AlertPopupBoxType = {
    closeModalWindow?: (boolean:boolean | any) => void
    btnOneConfiguration : {
        btnOneClassName? : string
        btnOneLabel : string
    }
    btnTwoConfiguration : {
        btnTwoHandler?: Function
        btnTwoLabel : string
        btnTwoClassName? : string
    }
    className?:string
    alertText: string
}

const AlertPopupBox = (props: AlertPopupBoxType) => {

    const {
        closeModalWindow = () => null,
        alertText,
        btnOneConfiguration : {btnOneLabel},
        btnTwoConfiguration : {btnTwoHandler = () => null, btnTwoLabel}
    } = props

    const onClickBtnTwoHandler = () => {
        btnTwoHandler()
        closeModalWindow(false)
    }

    return (
        <div className="alertPopupBox">
            <h2 className={"alertPopupBox__title"}>{alertText}</h2>
            <hr className={"my-4"}/>
            <div className="d-flex justify-content-between">
                <Button className={"btn-success col-lg-5"} onClickHandler={closeModalWindow} label={btnOneLabel}/>
                <Button className={"btn-danger col-lg-5"} onClickHandler={onClickBtnTwoHandler} label={btnTwoLabel}/>
            </div>
        </div>
    );
}

export default AlertPopupBox;