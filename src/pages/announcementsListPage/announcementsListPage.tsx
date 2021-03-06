import React, {useCallback, useEffect, useState} from 'react';
import "./announcementsListPageStyles.css"
import {useDispatch, useSelector} from "react-redux";
import {getAnnouncementsByFiltersThunk} from "../../redux/thunks/thunks";
import Announcement from "../../components/announcement/announcement";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import {useHistory} from 'react-router-dom';
import {
    getCurrentPageSearchReducerSelector,
    getIsFetchingSearchReducerSelector,
    getSearchConfigCategorySelector,
    getSearchConfigSubwayStationsSelector,
    getSearchedDataSelector,
    getTotalNumOfPageSearchReducerSelector
} from "../../redux/reducers/searchBoxState/searchBoxStateSelectors";
import SearchBox from "../../components/searchBox/searchBox";
import {
    resetToInitialStateSearchReducerAC,
    setCurrentPageSearchReducerAC
} from '../../redux/reducers/searchBoxState/searchBoxStateActionCreators';
import ButtonUp from "../../components/buttonUp/buttonUp";
import WithBadFetchingCasesWrapper from "../../components/withBadFetchingCasesWrapper/withBadFetchingCasesWrapper";
import Button from "../../components/button/button";
import CategoryNavigation from '../../components/categoryNavigation/categoryNavigation';
import useSetMetaTitleAndDescription from "../../hooks/useSetMetaTitleAndDescription";


const AnnouncementsListPage = (props: any) => {

    //------USE-HISTORY-----//
    const {location: {pathname}} = useHistory()

    //------MAP-STATE-TO-PROPS-----//

    //---SEARCHED-BOX-STATE---//
    const {name: currentCategory} = useSelector(getSearchConfigCategorySelector)
    const {name: currentSubway}: any = useSelector(getSearchConfigSubwayStationsSelector)

    useSetMetaTitleAndDescription(
        currentCategory,
        `Страница поиска объявлений в категории ${currentCategory} на Salam.ru`
    )

    const searchedData = useSelector(getSearchedDataSelector)
    const isFetchingSearchState = useSelector(getIsFetchingSearchReducerSelector)
    const currentPageSearch = useSelector(getCurrentPageSearchReducerSelector)
    const totalNumOfPageSearch = useSelector(getTotalNumOfPageSearchReducerSelector)
    const isEqualsCurrAndTotalPage = currentPageSearch === totalNumOfPageSearch
    //----------------------//
    // const isSearchState = searchedData.length || isFetchingSearchState
    //---ANNOUNCEMENTS-LIST-STATE---//
    // const announcementsList = useSelector(getAnnouncementsListSelector)
    // const currentPage = useSelector(getCurrentPageAnnouncementsListReducerSelector)
    // const totalNumOfPages = useSelector(getTotalNumOfPagesAnnouncementsListReducerSelector)
    // const isEqualsCurrAndTotalPage = currentPage === totalNumOfPages
    //---MAIN-STATE---//
    // const isFetchingMainState = useSelector(getIsFetchingMainStateSelector)
    // const isErrorFetchMainState = useSelector(getIsErrorFetchMainStateSelector)
    // const isEmptyResponseMainState = useSelector(getIsEmptyResponseMainStateSelector)

    //-----MAP-DISPATCH-TO-PROPS----//
    const dispatch = useDispatch()
    // const getAnnouncements = useCallback((category, withConcat = false) => dispatch(getAnnouncementsListThunk(category, withConcat)), [dispatch])
    const getAnnouncementsByFilters = useCallback((withConcat = true) => dispatch(getAnnouncementsByFiltersThunk(withConcat)), [dispatch])
    // const setCurrentPage = useCallback(() => dispatch(setCurrentPageAnnouncementsListReducerAC()), [dispatch])
    const setCurrentPageSearchBox = useCallback(() => dispatch(setCurrentPageSearchReducerAC()), [dispatch])
    // const resetToInitialStateAnnouncementsList = useCallback(() => dispatch(resetToInitialStateAnnouncementsListReducerAC()), [dispatch])
    const resetToInitialStateSearchReducer = useCallback(() => dispatch(resetToInitialStateSearchReducerAC()), [dispatch])

    //---GET-ACTIONS---//
    // const getDataAction: () => Function = () => isSearchState ? getAnnouncementsByFilters : getAnnouncements
    // const getDataState: () => Array<any> = () => isSearchState ? searchedData : announcementsList
    // const getSetCurrentPageAction: () => Function = () => isSearchState ? setCurrentPageSearchBox : setCurrentPage
    // const getIsEqualsCurrAndTotalPage: () => boolean = () => isSearchState ? isEqualsCurrAndTotalPageSearch : isEqualsCurrAndTotalPage

    //---LOCAL-STATE---//
    const [state, setState] = useState(() => ({currentCategory, currentSubway}))

    //----COMPONENT-DID-MOUNT/UNMOUNT-LIFECYCLE----//
    useEffect(() => {
        window.scrollTo(0, 50)
        // getAnnouncements(category)
        return () => {
            // resetToInitialStateAnnouncementsList()
            resetToInitialStateSearchReducer()
        }
    }, [])

    //----COMPONENT-DID-UPDATE-LIFECYCLE----//
    useEffect(() => {
        // resetToInitialStateAnnouncementsList()
        resetToInitialStateSearchReducer()
        !isFetchingSearchState && getAnnouncementsByFilters(false)
    }, [pathname])

    //----COMPONENT-DID-UPDATE-LIFECYCLE----//
    useEffect(() => {
        setState({currentCategory, currentSubway})
    }, [searchedData])

    //------INFINITY-SCROLL------//
    const infinityScrollHandler = (event?: any) => {
        if (!isEqualsCurrAndTotalPage) {
            setCurrentPageSearchBox()
            getAnnouncementsByFilters(true)
        }
    }
    useInfinityScroll(infinityScrollHandler)

    return (
        <>
            <SearchBox className={"mt-4"} placeHolder={"Поиск по объявлениям"}/>
            <div className="announcementsList__slider-container container-fluid d-lg-flex">
                <CategoryNavigation/>
                <div className="slider-container__content col-lg-8">
                    <h3 className={"alert alert-success mb-4 d-flex flex-column"}>
                        <span className={"font-weight-bold"}>Поиск по : </span>
                        {state.currentSubway}> {state.currentCategory}
                    </h3>
                    <WithBadFetchingCasesWrapper>
                        {searchedData.map(({id, ...restMyAnnouncement}: any) =>
                            <Announcement key={id} className={"horizontalCard"} id={id} {...restMyAnnouncement}/>)}
                    </WithBadFetchingCasesWrapper>
                    <ButtonUp/>
                </div>
                {!isEqualsCurrAndTotalPage &&
                <Button className={"btn-success w-100 my-4 mobile"} onClickHandler={infinityScrollHandler}
                        label={"Загрузить еще объявления"}/>}
            </div>
        </>
    );
}

export default AnnouncementsListPage;
