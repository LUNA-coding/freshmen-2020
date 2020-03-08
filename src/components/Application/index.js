import React, {Fragment} from "react";
import {useParams, useHistory} from "react-router-dom";
import useApplication from "../Hook/useApplication";
import Loading from "../Utils/Loading";
import Badge from "../Utils/Badge";

const Application = () => {
    const history = useHistory();

    const {applicationId} = useParams();
    const {applicationLoading, application, applicationExist} = useApplication({id: applicationId});

    return (
        <div className="container">
            <header className="py-5">
                <h1 className="font-weight-bold text-white">지원서</h1>
            </header>
            <div className="row">
                <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="card mb-2">
                        <div className="p-5">
                            {applicationLoading ? (
                                <div className="py-5">
                                    <Loading/>
                                </div>
                            ) : (
                                applicationExist ? (() => {
                                    const {studentId, name, contact, question1, question2, question3, major, grade} = application;
                                    return (
                                        <Fragment>
                                            <header className="d-flex align-items-center mb-5">
                                                <h4 className="font-weight-bolder mr-3">{name}</h4> <Badge major={major}
                                                                                                           className="mr-2"/>
                                                <Badge grade={grade}/>
                                            </header>
                                            <div className="mb-5">
                                                <p><span className="font-weight-bold mr-3">학번</span> {studentId}</p>
                                                <p><span className="font-weight-bold mr-3">연락처</span> {contact}</p>
                                            </div>
                                            <div className="mb-5">
                                                <p className="font-weight-bold">LUNA에 지원하게 된 동기가 무엇인가요?</p>
                                                <p>{question1}</p>
                                            </div>
                                            <div className="mb-5">
                                                <p className="font-weight-bold">자신이 생각하는 자신만의 장점과 단점은 무엇인가요?</p>
                                                <p>{question2}</p>
                                            </div>
                                            <div className="mb-5">
                                                <p className="font-weight-bold">LUNA에서 하고 싶은 활동과 이를 통해 이루고자 하는 꿈은 무엇인가요?</p>
                                                <p>{question3}</p>
                                            </div>
                                        </Fragment>
                                    );
                                })() : (
                                    <p>존재하지 않는 지원서입니다.</p>
                                )
                            )}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between text-white p-3 mb-5">
                        <div>
                            <h2 className="pointer"><i
                                className="fas fa-arrow-circle-left"/></h2>
                        </div>
                        <div className="d-flex align-items-center">
                            <h2 onClick={() => history.push('/admin')} className="pointer"><i
                                className="fas fa-home"/></h2>
                        </div>
                        <div>
                            <h2 className="pointer"><i
                                className="fas fa-arrow-circle-right"/></h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Application;