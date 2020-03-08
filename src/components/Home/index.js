import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import Loading from "../Utils/Loading";
import usePreferences from "../Hook/usePreferences";

import "./style.scss";
import * as ROUTES from "../../constants/routes";

const Home = () => {
    const history = useHistory();

    const {preferencesLoading, preferences} = usePreferences();
    const [active, setActive] = useState(false);

    return (
        <div className="container py-5">
            <header className="text-white mb-5">
                <h1 className="font-weight-bolder mb-0">안녕하세요,</h1>
                <h1 className="font-weight-lighter mb-0">루나에 오신 것을 환영합니다.</h1>
            </header>

            {preferencesLoading?(
                <div className="py-5">
                    <Loading/>
                </div>
            ):(
                preferences.active?(
                    <div className="row text-white">
                        <div id="btn-apply"
                             className={`col-6 col-md-4 offset-md-2 d-flex justify-content-center align-items-center ${active ? "active" : ""}`}
                             onClick={e => {
                                 setActive(true);
                                 setTimeout(() => {
                                     history.push(ROUTES.APPLY);
                                 }, 600);
                             }}>
                            <div className="p-1 d-flex justify-content-center align-items-center pointer mb-4"
                                 style={{border: '7px solid #ffffff', width: 300, height: 300}}>
                                <div className="text-center">
                                    <h2 id="text-apply" className="font-weight-bolder">지원하기</h2>
                                    <h4><i className="far fa-paper-plane"/></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-4 d-flex justify-content-center align-items-center"
                             onClick={e => {
                                 setActive(true);
                                 setTimeout(() => {
                                     history.push(ROUTES.EDIT);
                                 }, 100);
                             }}>
                            <div className="p-1 d-flex justify-content-center align-items-center hoverable pointer mb-4"
                                 style={{border: '7px solid #ffffff', width: 300, height: 300}}>
                                <div className="text-center">
                                    <h2 className="font-weight-bolder">지원서 확인</h2>
                                    <h4><i className="far fa-file-alt"/></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                ):(
                    <div className="text-center text-white py-5">
                        <h1 className="font-weight-light">지원이 마감되었습니다.<br/>감사합니다.</h1>
                    </div>
                )
            )}

        </div>
    );
};

export default Home;