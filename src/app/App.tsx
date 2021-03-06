import React, {useCallback, useEffect, useState} from 'react';
import "./appStyles.css"
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';
import FeedPage from "../pages/feedPage/feedPage";
import SettingsPage from "../pages/settingsPage/settingsPage";
import AnnouncementPage from '../pages/announcementPage/announcementPage';
import MyAnnouncementsPage from "../pages/myAnnouncementsPage/myAnnouncementsPage";
import CreateAnnouncement from "../pages/createAnnouncement/createAnnouncement";

import {useDispatch, useSelector} from "react-redux";
import {getMyAnnouncementsThunk, getSubwayStationsThunk, getUserInfoThunk} from "../redux/thunks/thunks";
import AnnouncementsListPage from "../pages/announcementsListPage/announcementsListPage";
import {
    getCategoriesDataSelector,
    getIsVisibleContestBannerSelector,
    getTheSubCategoriesSelector
} from "../redux/reducers/mainState/mainStateSelectors";
import {getIsAuthSelector} from "../redux/reducers/authorizationState/authorizationStateSelectors";
import CooperationPage from "../pages/cooperationPage/cooperationPage";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import SupportPage from "../pages/supportPage/supportPage";
import UnhandledRoutePage from "../pages/unhandledRoutePage/unhandledRoutePage";
import getPicture from "../pictures/svgIcons";
import ErrorFetchModalWindow from "../components/modalWindow/errorFetchModalWindow/errorFetchModalWindow";
import ContestModalWindow from "../components/modalWindow/contestModalWindow/contestModalWindow";

export const PATH_FEED = "/feed"
export const PATH_MY_ANNOUNCEMENTS = "/myAnnouncements"
export const PATH_CREATE_ANNOUNCEMENT = "/createAnnouncement"
export const PATH_SETTINGS = "/settings"
export const PATH_SEARCH = "/search"
export const GET_PATH_SEARCH = (category: string) => `${PATH_SEARCH}/${category}`
export const PATH_CONTACTS = "/contacts"
export const PATH_COOPERATION = "/cooperation"
export const PATH_SUPPORT = "/support"

export const linkToCreateAnnouncement = (className?: string) => <>
    <NavLink activeClassName={"active"}
             className={`createAnnouncement__link btn btn-outline-light flex-grow-1 flex-shrink-03 flex-md-grow-0 my-3 my-xl-0 ${className}`}
             to={PATH_CREATE_ANNOUNCEMENT}>
        <span className={"mr-2"}>{getPicture("createAnnouncement")}</span>
        Разместить объявление
    </NavLink>
</>

const App = () => {

    //------MAP-STATE-TO-PROPS-----//
    const categoriesData = useSelector((state) =>
        getTheSubCategoriesSelector(getCategoriesDataSelector(state)))
    const isAuth = useSelector(getIsAuthSelector)
    const isVisibleContestBanner = useSelector(getIsVisibleContestBannerSelector)

    //-----MAP-DISPATCH-TO-PROPS----//
    const dispatch = useDispatch()
    const getSubwayStations = useCallback(() => dispatch(getSubwayStationsThunk()), [dispatch])
    const getUserData = useCallback(() => dispatch(getUserInfoThunk()), [dispatch])
    const getMyAnnouncements = useCallback(() => dispatch(getMyAnnouncementsThunk()), [dispatch])

    //-----LOCAL-STATE----//
    const [isVisibleContestBannerLocalState, setIsVisibleContestBanner] = useState(false)

    useEffect(() => {
        setTimeout(() => setIsVisibleContestBanner(isVisibleContestBanner), 4000)
    }, [isVisibleContestBanner])

    useEffect(() => {
        getSubwayStations()
        isAuth && getUserData()
    }, [])

    useEffect(() => {
        isAuth && getMyAnnouncements()
    }, [isAuth])

    return (
        <div className="App bg-light fullHeightContent">
            <ContestModalWindow isActiveFromProps={isVisibleContestBannerLocalState}/>
            <ErrorFetchModalWindow/>
            <Header/>
            <Switch>
                <Route exact path={"/"} component={() => <Redirect to={PATH_FEED}/>}/>
                <Route exact path={PATH_CREATE_ANNOUNCEMENT} component={CreateAnnouncement}/>
                <Route exact path={PATH_FEED} component={FeedPage}/>
                <Route exact path={PATH_MY_ANNOUNCEMENTS} component={MyAnnouncementsPage}/>
                <Route exact path={PATH_SETTINGS} component={SettingsPage}/>
                <Route exact path={PATH_COOPERATION} component={CooperationPage}/>
                <Route exact path={PATH_SUPPORT} component={SupportPage}/>
                {categoriesData.reduce( (array:Array<any>, {category}: any) => {
                    array.push(<Route exact path={`${GET_PATH_SEARCH(category)}`} component={AnnouncementsListPage}/>)
                    array.push(<Route exact path={`${GET_PATH_SEARCH(category)}/:id`} component={AnnouncementPage}/>)
                    return array
                }, [] ) }
                <Route component={UnhandledRoutePage}/>
            </Switch>
            <Footer/>
        </div>
    );
}

export default App;
