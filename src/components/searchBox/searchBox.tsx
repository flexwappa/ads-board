import React, {useCallback, useState} from 'react';
import "./searchBoxStyles.css";
import Select from "./select/select";
import {useDispatch, useSelector} from "react-redux";
import {getAnnouncementsByFiltersThunk} from "../../redux/thunks/thunks";
import Button from "../button/button";
import {
    getCategoriesDataSelector,
    getSubwayStationsDataSelector
} from "../../redux/reducers/mainState/mainStateSelectors";
import {
    getIsFetchingSearchReducerSelector,
    getSearchConfigCategorySelector,
    getSearchConfigSearchValueSelector,
    getSearchConfigSubwayStationsSelector
} from "../../redux/reducers/searchBoxState/searchBoxStateSelectors";
import {useHistory} from 'react-router-dom';
import {
    resetToInitialStateSearchReducerAC,
    setSearchConfigCategoryAC,
    setSearchConfigSearchValueAC,
    setSearchConfigSubwayStationsAC
} from '../../redux/reducers/searchBoxState/searchBoxStateActionCreators';

const SearchBox = (props: any) => {

    const {placeHolder} = props

    //------USE-HISTORY-----//
    const history = useHistory()

    //------MAP-STATE-TO-PROPS-----//
    const subwayStationsData = useSelector(getSubwayStationsDataSelector)
    const categoriesData = useSelector(getCategoriesDataSelector)
    const isFetching = useSelector(getIsFetchingSearchReducerSelector)
    const searchConfigCategory = useSelector(getSearchConfigCategorySelector)
    const searchConfigSubwayStation = useSelector(getSearchConfigSubwayStationsSelector)
    const searchConfigSearchValue = useSelector(getSearchConfigSearchValueSelector)

    //-----MAP-DISPATCH-TO-PROPS----//
    const dispatch = useDispatch()
    const getAnnouncementsByFilters = useCallback(() => dispatch(getAnnouncementsByFiltersThunk()), [dispatch])
    const resetToInitialStateSearchReducer = useCallback(() => dispatch(resetToInitialStateSearchReducerAC()), [dispatch])
    const setSearchConfigCategory = useCallback((category) => dispatch(setSearchConfigCategoryAC(category)), [dispatch])
    const setSearchConfigSubwayStation = useCallback((station) => dispatch(setSearchConfigSubwayStationsAC(station)), [dispatch])
    const setSearchConfigSearchValue = useCallback((value) => dispatch(setSearchConfigSearchValueAC(value)), [dispatch])

    //-----LOCAL-STATE-----//
    const [searchValue, setSearchValue] = useState(searchConfigSearchValue)


    const selectItemOnChangeHandler = (field: "category" | "subway", selectItem: any, setIsActiveSelect:Function) => {
        field === "category" && setSearchConfigCategory(selectItem)
        field === "subway" && setSearchConfigSubwayStation(selectItem)
        setIsActiveSelect(false)
    }

    const searchOnChangeHandler = (event?: any) => {
        const { target : {value = ""} = {} } = event || {}
        setSearchValue(value)
    }

    const onClickFindBtnHandler = () => {
        getAnnouncementsByFilters()
        resetToInitialStateSearchReducer()
        setSearchValue("")
        history.push(searchConfigCategory.category)
    }

  return (
      <div className="searchBox">
          <Select onChangeHandlerSelectItem={(selectItem: any, handler: any) => selectItemOnChangeHandler("subway", selectItem, handler)} value={searchConfigSubwayStation.label} selectItems={subwayStationsData} placeHolder={"Выбор категории"}/>
          <div className="searchBox__search">
              <input onBlur={({target: {value}}) => setSearchConfigSearchValue(value)} onChange={searchOnChangeHandler}
                     className={"searchBox__search-input"}
                     value={searchValue} type="text"
                     placeholder={placeHolder}/>
              <div onClick={() => setSearchValue("")} className={"searchBox__search-clear"}>&#10006;</div>
          </div>
          <Select onChangeHandlerSelectItem={(selectItem: any, handler: any) => selectItemOnChangeHandler("category", selectItem, handler)} value={searchConfigCategory.label} selectItems={categoriesData} placeHolder={"Метро"}/>
          <Button onClickHandler={onClickFindBtnHandler} label={"Найти"} isDisabled={isFetching}/>
          <Button onClickHandler={resetToInitialStateSearchReducer} label={"Очистить"} isDisabled={false}/>
      </div>
  );
}

export default SearchBox;