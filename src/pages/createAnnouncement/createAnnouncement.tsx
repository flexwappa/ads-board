import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import "./createAnnouncementStyles.css"
import {useDispatch, useSelector} from "react-redux";
import {postNewAnnouncementThunk} from "../../redux/thunks/thunks";
import TextInput from "../../components/textInput/textInput";
import Select from "../../components/searchBox/select/select";
import Button from "../../components/button/button";
import Picture from "../../components/picture/picture";
import {
    getCategoriesDataSelector,
    getSubwayStationsDataSelector,
    getTheSubCategoriesSelector
} from "../../redux/reducers/mainState/mainStateSelectors";
import {
    checkIsReadyToSendByPageFormReducerAC,
    resetToInitialByPageFormReducerAC,
    setIsValidFormReducerAC,
    seValueFormReducerAC
} from "../../redux/reducers/formState/formStateActionCreators";
import {getFieldsByPageFormReducerSelector} from "../../redux/reducers/formState/formStateSelectors";
import {getSettingsFieldValueByFieldSelector} from "../../redux/reducers/settingsState/settingsStateSelectors";
import withAuthRedirectHoc from "../../hocs/withAuthRedirectHoc";
import ImagePicker, {MAX_FILE_SIZE} from "../../components/imagePicker/imagePicker";
import AlertModalWindow from "../../components/modalWindow/alertModalWindow/alertModalWindow";
import useSetMetaTitleAndDescription from "../../hooks/useSetMetaTitleAndDescription";
import {getIsFetchingSelector} from '../../redux/reducers/fetchingState/fetchingStateSelectors';

type CreateAnnouncementFieldsType =
    "photos"
    | "name"
    | "price"
    | "category"
    | "description"
    | "subway"
    | "phone"
    | string

const CreateAnnouncement = (props: any) => {

    useSetMetaTitleAndDescription(
        "Создание объявления",
        "Создание объявления на Salam.ru"
    )

    //------MAP-STATE-TO-PROPS-----//
    const subwayStationsData = useSelector(getSubwayStationsDataSelector)
    const [defaultCategory, ...categoriesData] = useSelector( (state) =>
        getTheSubCategoriesSelector(getCategoriesDataSelector(state), "bg-info text-white no-cursor font-weight-bold text-center"))
    const phoneRedux = useSelector( (state) => getSettingsFieldValueByFieldSelector(state, "phone"))
    const formState = useSelector((state) => getFieldsByPageFormReducerSelector(state, "createAnnouncement"))
    const {
        photoList, name,
        price, category,
        description,
        sellerPhone, stationId,
        isReadyToSend
    } = formState

    const isFetching = useSelector((state) => getIsFetchingSelector(state, "createAnnouncement"))

    //-----MAP-DISPATCH-TO-PROPS----//
    const dispatch = useDispatch()
    const postNewAnnouncement = useCallback(() => dispatch(postNewAnnouncementThunk()), [dispatch])
    const setValueFormReducer = useCallback((value, field) => dispatch(seValueFormReducerAC(value, field, "createAnnouncement")), [dispatch])
    const setIsValidFormReducer = useCallback((field) => dispatch(setIsValidFormReducerAC(field, "createAnnouncement")), [dispatch])
    const checkIsReadyToSend = useCallback(() => dispatch(checkIsReadyToSendByPageFormReducerAC("createAnnouncement")), [dispatch])
    const resetToInitialByPageFormReducer = useCallback(() => dispatch(resetToInitialByPageFormReducerAC("createAnnouncement")), [dispatch])

    //------LOCAL-STATE-----//
    const [isMaxSizeFile, setIsMaxSizeFile] = useState(false)

    //------DID-MOUNT-LIFE-CYCLE-----//
    useEffect(() => {
        setValueFormReducer(phoneRedux, "sellerPhone")
        return () => {
            resetToInitialByPageFormReducer()
        }
    }, [])

    //------DID-UPDATE-LIFE-CYCLE-----//
    useEffect(() => {
        if(isReadyToSend) {
            // const condition = (postData: any, key: any, value: any) => {
            //     postData[key] = value
            //     if(key === "category") postData[key] = value.category
            //     if(key === "stationId") postData[key] = value.id
            //     return postData
            // }
            // const postData = prepareFormStateByPageForSend(formState)(condition)
            postNewAnnouncement()
        }
    }, [isReadyToSend])

    const selectItemOnChangeHandler = (field: "category" | "stationId", selectItem: any, setIsActiveSelect: Function) => {
        if("className" in selectItem) return false
        isMaxSizeFile && setIsMaxSizeFile(false)
        setValueFormReducer(selectItem, field)
        setIsActiveSelect(false)
    }

    const onLoadImageHandler = (file: any) => {
        if(file.size > MAX_FILE_SIZE) setIsMaxSizeFile(true)
        else {
            const value = photoList.value.concat(file)
            setValueFormReducer(value, "photoList")
        }
    }

    //Функция - обработчик события изменеия в инпуте. Проверка на валидность значения в инпуте.
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, field: CreateAnnouncementFieldsType) => {
        console.log("onChangeHandler", field)
        setIsMaxSizeFile(false)
        const {currentTarget: {value}} = event
        setValueFormReducer(value, field)
    }

    const deleteLoadedImage = (fileName: string) => {
        const newPhotosValue = photoList.value.filter( ({name}: any) => name !== fileName)
        setValueFormReducer(newPhotosValue, "photoList")
    }

    //Функция возращает массив с конфигурацией для полей ввода
    const getInputsParamsConfig = () => {
        return [
            {
                field: "name",
                label: "Название",
                inputType: "text",
                value: name.value,
                isValid: name.isValid
            },
            {
                field: "price",
                label: "Цена",
                inputType: "number",
                value: price.value,
                isValid: price.isValid
            },
            {
                field: "description",
                label: "Описание",
                inputType: "textArea",
                value: description.value,
                isValid: description.isValid
            },
        ]
    }

    // const {name, subway, photos, description, phone, category, price} = state

    const getErrorClassName = (field: "category" | "stationId") =>
        !formState[field].isValid && "createAnnouncement__title-error"

    return (
        <div className="createAnnouncement__container container-lg pt-5">
                <h1 className="display-5 jumbotron p-2 mb-5">Создание объявления</h1>
                <div className="createAnnouncement__category d-flex">
                    <h4 className={`createAnnouncement__category-title col-lg-3 text-left p-0 ${getErrorClassName("category")}`}>
                        Категория
                    </h4>
                    <Select className={"col-lg-4"} onBlurHandler={() => setIsValidFormReducer("category")}
                        onChangeHandlerSelectItem={(selectItem: any, handler: any) => selectItemOnChangeHandler("category", selectItem, handler)}
                        value={category.value.name} selectItems={categoriesData} placeHolder={"Выбор категории"}/>
                </div>
                <hr className="my-4"/>
                <div className="createAnnouncement__params d-block d-lg-flex">
                    <h4 className="createAnnouncement__params-title col-lg-3 text-lg-left p-0 text-center">Параметры</h4>
                    <div className="col-lg-4 p-0">
                        {getInputsParamsConfig().map(({field, ...restConfig}) =>
                            <TextInput className={"mb-3"} key={field} {...restConfig}
                                       onBlurHandler={() => setIsValidFormReducer(field)}
                                       onChangeHandler={(event: ChangeEvent<HTMLInputElement>) => onChangeHandler(event, field)}/>)}

                        <div className="createAnnouncement__params-photos position-relative">
                            <div className="">
                                <span className={"createAnnouncement__params-photos-label mb-3"}>
                                    {`Фотографии ${photoList.value.length} из 5`}
                                </span>
                            {isMaxSizeFile &&
                            <span className={"mt-2 text-danger text-left d-block font-weight-bold"}>
                                Cлишком большой размер файла
                            </span>}
                            </div>
                            <div className="createAnnouncement__params-photos-files justify-content-between d-flex align-items-center flex-wrap flex-lg-nowrap">
                                {photoList.value.map( (file: any) =>
                                    <Picture onClickHandler={() => deleteLoadedImage(file.name)} className={"createAnnouncement__params-photos-files-file col-lg-4 mr-lg-2"} photo={file}/> )}
                                {photoList.value.length < 5 &&
                                <ImagePicker className={"col-lg-4 p-0 my-3"} onLoadHandler={onLoadImageHandler}/>}
                            </div>
                            <span className={"mt-2"}>Чтобы удалить фото - нажмите на него</span>
                        </div>
                    </div>
                </div>
                <hr className="my-4"/>
                <div className="createAnnouncement__location d-flex">
                    <h4 className={`createAnnouncement__location-title col-lg-3 text-left p-0 ${getErrorClassName("stationId")}`}>Станция метро</h4>
                    <Select className={"col-lg-4 p-0"} onBlurHandler={() => setIsValidFormReducer("stationId")}
                        onChangeHandlerSelectItem={(selectItem: any, handler: any) => selectItemOnChangeHandler("stationId", selectItem, handler)}
                        value={stationId.value.name} selectItems={subwayStationsData} placeHolder={"Выбор метро"}/>
                </div>
                <hr className="my-4"/>

                <div className="createAnnouncement__contacts d-flex">
                    <h4 className="createAnnouncement__contacts-title col-lg-3 text-left p-0">Контакты</h4>
                    <TextInput className={"col-lg-3 p-0"} isValid={sellerPhone.isValid} value={sellerPhone.value}
                               placeholder={"Номер телефона"} label={"Телефон"} inputType={"number"}
                               onBlurHandler={() => setIsValidFormReducer("sellerPhone")}
                               onChangeHandler={(event: ChangeEvent<HTMLInputElement>) => onChangeHandler(event, "sellerPhone")}/>
                </div>
                <hr className="my-4"/>
                <div className={"d-lg-flex justify-content-around mb-5 col-lg-7 p-0 d-block"}>
                    <Button className={"btn-success col-lg-7 my-3 my-lg-0"} label={"Создать объявление"} isDisabled={isFetching} onClickHandler={checkIsReadyToSend}/>
                    <AlertModalWindow openBtnElement={<Button className={"btn-danger col-lg-4"} label={"Очистить поля"} />}
                                      btnOneConfiguration={{btnOneLabel: "Нет" }}
                                      btnTwoConfiguration={{btnTwoLabel: "Да", btnTwoHandler:resetToInitialByPageFormReducer }}
                                      alertText={"Сбросить все введённые данные?"}/>
                </div>
            </div>
    );
}

export default withAuthRedirectHoc(CreateAnnouncement);
