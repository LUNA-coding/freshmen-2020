import React, {Fragment, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useToasts} from "react-toast-notifications";
import Loading from "../Utils/Loading";
import firebase from "firebase/app";
import "firebase/firestore";

import "./style.scss";
import logo from "../../logo.png";
import person from "./person.jpeg";
import useApplication from "../Hook/useApplication";
import usePreferences from "../Hook/usePreferences";

const Apply = ({userStudentId = null, userName = null, userPassword = null}) => {
    const history = useHistory();
    const {addToast} = useToasts();

    const {preferencesLoading, preferences} = usePreferences();
    const {applicationLoading, application, applicationExist} = useApplication({
        studentId: userStudentId,
        name: userName,
        password: userPassword
    });

    // 이스터에그
    const [count, setCount] = useState(0);

    // 주의사항
    const [warningCheck, setWarningCheck] = useState(false);

    // 학번, 이름, 연락처, 비밀번호
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [check, setCheck] = useState(false);
    const [page1Check, setPage1Check] = useState(false);

    // 문항 1, 2, 3
    const [question1, setQuestion1] = useState('');
    const [question2, setQuestion2] = useState('');
    const [question3, setQuestion3] = useState('');
    const [page2Check, setPage2Check] = useState(false);
    const [page3Check, setPage3Check] = useState(false);
    const [page4Check, setPage4Check] = useState(false);

    // 페이지 기능 관련
    const [mode, setMode] = useState('create'); // create, view, edit
    const [page, setPage] = useState(0);
    const [done, setDone] = useState(false);
    const [allCheck, setAllCheck] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!applicationLoading) {
            if (applicationExist) {
                if (!done) {
                    setMode('edit');
                    setCheck(true);

                    const {studentId, name, contact, password, question1, question2, question3} = application;
                    setStudentId(studentId);
                    setName(name);
                    setContact(contact);
                    setPassword(password);
                    setQuestion1(question1);
                    setQuestion2(question2);
                    setQuestion3(question3);

                    setDone(true);
                }
            }
            setPage1Check(studentId !== '' && name !== '' && contact !== '' && password !== '' && check);
            setPage2Check(question1 !== '');
            setPage3Check(question2 !== '');
            setPage4Check(question3 !== '');
            setAllCheck(page1Check && page2Check && page3Check && page4Check);
        }
    }, [applicationExist, applicationLoading, check, contact, name, page1Check, page2Check, page3Check, page4Check, password, question1, question2, question3, studentId]);

    const validateStudentId = studentId => {
        if (!studentId.isNaN) {
            if (studentId.length === 4) {
                const grade = parseInt(studentId.slice(0, 1));
                const major = parseInt(studentId.slice(1, 2));
                if (grade > 0) {
                    if (major >= 1 && major <= 6) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setLoading(true);

        if (validateStudentId(studentId)) {
            if (mode === 'create') {
                const duplicateCheck = await firebase.firestore().collection('applications')
                    .where('studentId', '==', studentId)
                    .where('name', '==', name)
                    .get();
                if (duplicateCheck.empty) {
                    firebase.firestore().collection('applications').add({
                        studentId,
                        name,
                        contact,
                        password,
                        question1,
                        question2,
                        question3,
                        createdAt: new Date()
                    })
                        .then(() => {
                            addToast('지원이 완료되었습니다.', {appearance: 'success', autoDismiss: true});
                            setLoading(false);
                            history.push('/');
                        })
                        .catch(err => {
                            addToast('지원서 제출 과정에서 오류가 발생했습니다. 관리자에게 문의해 주세요.', {
                                appearance: 'error',
                                autoDismiss: true
                            });
                            console.error(err);
                            setLoading(false);
                        });
                } else {
                    addToast('이미 같은 학번과 이름으로 제출된 지원서가 있습니다.', {appearance: 'error', autoDismiss: true});
                    setLoading(false);
                }
            } else {
                // edit
                const unsubscribe = firebase.firestore().doc(`/applications/${application.id}`).update({
                    contact,
                    question1,
                    question2,
                    question3,
                    updatedAt: new Date()
                })
                    .then(() => {
                        addToast('지원서 수정이 완료되었습니다.', {appearance: 'success', autoDismiss: true});
                        history.push('/');
                    })
                    .catch(err => {
                        console.error(err);
                        addToast('지원서 수정 과정에서 오류가 발생했습니다. 관리자에게 문의하세요.', {appearance: 'error', autoDismiss: true});
                    });

                return () => unsubscribe;
            }
        } else {
            addToast('올바른 학번을 입력해 주세요.', {appearance: 'error', autoDismiss: true});
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row no-gutters">
                <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 d-flex align-items-center"
                     style={{height: '100vh'}}>
                    <div className="animated fadeInUp" style={{width: '100%'}}>
                        {page !== 0 ? (
                            <div className="d-flex mb-3">
                                <div onClick={e => setPage(1)}
                                     className={`progress-number ${page >= 1 ? page1Check ? "active" : "invalid" : ""}`}>1
                                </div>
                                <div className={`progress-link ${page >= 2 ? page2Check ? "active" : "invalid" : ""}`}>
                                    <i
                                        className="fas fa-caret-right"/></div>
                                <div onClick={e => setPage(2)}
                                     className={`progress-number ${page >= 2 ? page2Check ? "active" : "invalid" : ""}`}>2
                                </div>
                                <div className={`progress-link ${page >= 3 ? page3Check ? "active" : "invalid" : ""}`}>
                                    <i
                                        className="fas fa-caret-right"/></div>
                                <div onClick={e => setPage(3)}
                                     className={`progress-number ${page >= 3 ? page3Check ? "active" : "invalid" : ""}`}>3
                                </div>
                                <div className={`progress-link ${page >= 4 ? page4Check ? "active" : "invalid" : ""}`}>
                                    <i
                                        className="fas fa-caret-right"/></div>
                                <div onClick={e => setPage(4)}
                                     className={`progress-number ${page >= 4 ? page4Check ? "active" : "invalid" : ""}`}>4
                                </div>
                                <div className={`progress-link ${page >= 5 ? allCheck ? "active" : "invalid" : ""}`}><i
                                    className="fas fa-caret-right"/></div>
                                <div onClick={e => setPage(5)}
                                     className={`progress-number ${page >= 5 ? allCheck ? "active" : "invalid" : ""}`}>
                                    <i
                                        className="fas fa-check"/></div>
                            </div>
                        ) : (
                            <Fragment/>
                        )}
                        <div className="card border-0 shadow-lg" style={{borderRadius: 20}}>
                            <div className="p-4">
                                {applicationLoading ? (
                                    <Loading/>
                                ) : (
                                    (() => {
                                        switch (page) {
                                            case 0:
                                                return (
                                                    <Fragment>
                                                        <h2 className="text-center text-purple font-weight-bolder mb-5">LUNA
                                                            지원 시 주의사항</h2>
                                                        <form onSubmit={e => {
                                                            e.preventDefault();
                                                            setPage(1);
                                                        }}>
                                                            <p>
                                                                <ol style={{paddingLeft: '1rem', fontSize: '0.9rem'}}>
                                                                    <li>본 사이트는 한국디지털미디어고등학교 LUNA의 신입생 모집을 위한 사이트입니다.
                                                                    </li>
                                                                    <li>작년 기준으로 지원이 가능한 교내 동아리는 최대 3개였으며 이를 유의하여 지원
                                                                        부탁드립니다.
                                                                    </li>
                                                                    <li>반드시 본인의 올바른 학번과 이름을 입력하시고 패스워드를 기억해주시길 바랍니다.
                                                                    </li>
                                                                    <li>지원서 마감 전까지는 얼마든지 수정이 가능합니다. 우선 제출해두고 조금씩
                                                                        수정해나가세요!
                                                                    </li>
                                                                    <li>작성한 지원서는 선발에 아주 큰 영향을 미칠 수 있으므로 성의껏 작성 부탁드립니다.
                                                                    </li>
                                                                    <li>연락처는 공지용입니다. 선발이 끝나는 즉시 폐기합니다.</li>
                                                                    <li>마감 일정에 대한 자세한 내용은 개학 이후 다시 공지해드리겠습니다.</li>
                                                                    <li>존재하지 않는 학번과 이름 및 타인의 학번과 이름을 도용했을 경우에는 예고없이 삭제될
                                                                        수 있습니다.
                                                                    </li>
                                                                    <li>기타 문의가 있으시다면 <a
                                                                        href="https://www.fb.com/lunacoding"
                                                                        target="_blank">페이스북 페이지</a> 혹은 <a
                                                                        href="https://www.instagram.com/dimigo._.luna/"
                                                                        target="_blank">인스타그램</a>으로 문의해주시길 바랍니다.
                                                                    </li>
                                                                </ol>
                                                            </p>
                                                            <div className="form-group form-check">
                                                                <input type="checkbox"
                                                                       className="form-check-input"
                                                                       id="check" defaultChecked={warningCheck}
                                                                       value={warningCheck}
                                                                       onChange={e => setWarningCheck(e.currentTarget.checked)}/>
                                                                <label className="form-check-label"
                                                                       htmlFor="check">모든 주의사항을 읽고, 확인했습니다.</label>
                                                            </div>
                                                            <div className="text-center">
                                                                <button type="submit" className="btn">
                                                                    {(warningCheck) ? (
                                                                        <h1 className="text-success animated rubberBand">
                                                                            <i className="far fa-check-circle"/>
                                                                        </h1>
                                                                    ) : (
                                                                        <h1 className="text-danger animated swing fast">
                                                                            <i className="far fa-times-circle"/>
                                                                        </h1>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </Fragment>
                                                );
                                            case 1:
                                                return (
                                                    <Fragment>
                                                        <h2 className="text-center text-purple font-weight-bolder mb-5">지원자
                                                            정보 입력</h2>
                                                        <form onSubmit={e => e.preventDefault()}>
                                                            <div className="row mb-4">
                                                                <div className="col-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor="studentId">학번</label>
                                                                        <input type="text" className="form-control"
                                                                               id="studentId"
                                                                               value={studentId}
                                                                               onChange={e => setStudentId(e.currentTarget.value)}
                                                                               placeholder="학번 ex) 1428"
                                                                               disabled={mode === 'edit' || mode === 'view'}
                                                                               maxLength={4}
                                                                               required/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="form-group">
                                                                        <label htmlFor="name">이름</label>
                                                                        <input type="text" className="form-control"
                                                                               id="name" value={name}
                                                                               onChange={e => setName(e.currentTarget.value)}
                                                                               placeholder="이름"
                                                                               disabled={mode === 'edit' || mode === 'view'}
                                                                               required/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="form-group">
                                                                        <label htmlFor="contact">연락처</label>
                                                                        <input type="text" className="form-control"
                                                                               id="contact"
                                                                               value={contact}
                                                                               onChange={e => setContact(e.currentTarget.value)}
                                                                               placeholder="연락처 (전화번호, 카톡 아이디 등)"
                                                                               required/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="form-group">
                                                                        <label htmlFor="password">비밀번호</label>
                                                                        <input type="password" className="form-control"
                                                                               id="password"
                                                                               value={password}
                                                                               onChange={e => setPassword(e.currentTarget.value)}
                                                                               placeholder="비밀번호"
                                                                               disabled={mode === 'edit' || mode === 'view'}
                                                                               required/>
                                                                        <small>비밀번호는 지원서 확인에 사용됩니다.</small>
                                                                    </div>
                                                                </div>
                                                                {mode === 'edit' || mode === 'view' ? (
                                                                    <Fragment/>
                                                                ) : (
                                                                    <div className="col-12">
                                                                        <div className="form-group form-check">
                                                                            <input type="checkbox"
                                                                                   className="form-check-input"
                                                                                   id="check" defaultChecked={check}
                                                                                   value={check}
                                                                                   onChange={e => setCheck(e.currentTarget.checked)}/>
                                                                            <label className="form-check-label"
                                                                                   htmlFor="check">학번,
                                                                                이름, 연락처 정보를 정확하게 입력했습니다.</label>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-center">
                                                                <button type="submit" className="btn">
                                                                    {(page1Check) ? (
                                                                        <h1 className="text-success animated rubberBand">
                                                                            <i className="far fa-check-circle"/>
                                                                        </h1>
                                                                    ) : (
                                                                        <h1 className="text-danger animated swing fast">
                                                                            <i className="far fa-times-circle"/>
                                                                        </h1>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </Fragment>
                                                );
                                            case 2:
                                                return (
                                                    <Fragment>
                                                        <h2 className="text-center text-purple font-weight-bolder mb-5">질문
                                                            1</h2>
                                                        <p className="font-weight-bold text-purple text-center">LUNA에
                                                            지원하게 된
                                                            동기가 무엇인가요?</p>
                                                        <form onSubmit={e => e.preventDefault()}>
                                                            <div className="form-group">
                                                            <textarea id="question1" rows="7" className="form-control"
                                                                      value={question1}
                                                                      onChange={e => setQuestion1(e.currentTarget.value)}
                                                                      placeholder="질문에 대한 답을 입력하세요."
                                                                      required/>
                                                            </div>
                                                            <div className="text-center">
                                                                <button type="submit" className="btn">
                                                                    {page2Check ? (
                                                                        <h1 className="text-success animated rubberBand">
                                                                            <i className="far fa-check-circle"/>
                                                                        </h1>
                                                                    ) : (
                                                                        <h1 className="text-danger animated swing fast">
                                                                            <i className="far fa-times-circle"/>
                                                                        </h1>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </Fragment>
                                                );
                                            case 3:
                                                return (
                                                    <Fragment>
                                                        <h2 className="text-center text-purple font-weight-bolder mb-5">질문
                                                            2</h2>
                                                        <p className="font-weight-bold text-purple text-center">자신이 생각하는
                                                            자신만의 장점과 단점은 무엇인가요?</p>
                                                        <form onSubmit={e => e.preventDefault()}>
                                                            <div className="form-group">
                                                            <textarea id="question2" rows="7" className="form-control"
                                                                      value={question2}
                                                                      onChange={e => setQuestion2(e.currentTarget.value)}
                                                                      placeholder="질문에 대한 답을 입력하세요."
                                                                      required/>
                                                            </div>
                                                            <div className="text-center">
                                                                <button type="submit" className="btn">
                                                                    {page3Check ? (
                                                                        <h1 className="text-success animated rubberBand">
                                                                            <i className="far fa-check-circle"/>
                                                                        </h1>
                                                                    ) : (
                                                                        <h1 className="text-danger animated swing fast">
                                                                            <i className="far fa-times-circle"/>
                                                                        </h1>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </Fragment>
                                                );
                                            case 4:
                                                return (
                                                    <Fragment>
                                                        <h2 className="text-center text-purple font-weight-bolder mb-5">질문
                                                            3</h2>
                                                        <p className="font-weight-bold text-purple text-center">LUNA에서
                                                            하고 싶은
                                                            활동과 이를 통해 이루고자 하는 꿈은 무엇인가요?</p>
                                                        <form onSubmit={e => e.preventDefault()}>
                                                            <div className="form-group">
                                                            <textarea id="question3" rows="7" className="form-control"
                                                                      value={question3}
                                                                      onChange={e => setQuestion3(e.currentTarget.value)}
                                                                      placeholder="질문에 대한 답을 입력하세요."
                                                                      required/>
                                                            </div>
                                                            <div className="text-center">
                                                                <button type="submit" className="btn">
                                                                    {page4Check ? (
                                                                        <h1 className="text-success animated rubberBand">
                                                                            <i className="far fa-check-circle"/>
                                                                        </h1>
                                                                    ) : (
                                                                        <h1 className="text-danger animated swing fast">
                                                                            <i className="far fa-times-circle"/>
                                                                        </h1>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </Fragment>
                                                );
                                            case 5:
                                                return (
                                                    <Fragment>
                                                        <h2 className="text-center text-purple font-weight-bolder mb-5">지원서 {mode === 'create' ? "제출" : "수정"}</h2>
                                                        <p className="mb-4">정말로 지원서를 제출하시겠습니까?<br/>(지원서는 제출 후에도 언제든지
                                                            수정할
                                                            수
                                                            있습니다.)</p>
                                                        <div className="text-center">
                                                            {preferencesLoading?(
                                                                <Loading/>
                                                            ):(
                                                                preferences.active?(
                                                                    allCheck ? (
                                                                        loading ? (
                                                                            <Loading/>
                                                                        ) : (
                                                                            <button type="button" className="btn"
                                                                                    onClick={handleSubmit}>
                                                                                <h1 className="text-purple animated rubberBand">
                                                                                    <i className="fas fa-paper-plane"/>
                                                                                </h1>
                                                                            </button>
                                                                        )
                                                                    ) : (
                                                                        <button type="button" className="btn"
                                                                                title="지원서를 제출할 수 없습니다. 지원서를 모두 작성했는지 확인해주세요."
                                                                                onClick={() => check ? addToast('지원서를 제출할 수 없습니다. 지원서를 모두 작성했는지 확인해주세요.', {
                                                                                    appearance: 'error',
                                                                                    autoDismiss: true
                                                                                }) : addToast("'학번, 이름, 연락처를 정확하게 입력했습니다.'를 체크해주세요.", {
                                                                                    appearance: 'error',
                                                                                    autoDismiss: true
                                                                                })}>
                                                                            <h1 className="text-danger animated swing fast">
                                                                                <i className="far fa-times-circle"/>
                                                                            </h1>
                                                                        </button>
                                                                    )
                                                                ):(
                                                                    <button type="button" className="btn"
                                                                            title="지원이 마감되었습니다."
                                                                            onClick={() => addToast('지원이 마감되었습니다.', {
                                                                                appearance: 'error',
                                                                                autoDismiss: true
                                                                            })}>
                                                                        <h1 className="text-danger animated swing fast">
                                                                            <i className="far fa-times-circle"/>
                                                                        </h1>
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </Fragment>
                                                );
                                            default:
                                                return <div>잘못된 요청입니다.</div>;
                                        }
                                    })()
                                )}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between text-white p-3">
                            <div>
                                {page !== 0 && page !== 1 ? (
                                    <h2 onClick={() => setPage(page - 1)} style={{cursor: 'pointer'}}><i
                                        className="fas fa-arrow-circle-left"/></h2>
                                ) : (
                                    <h2 onClick={() => history.push('/')} style={{cursor: 'pointer'}}><i
                                        className="fas fa-home"/></h2>
                                )}
                            </div>
                            <div className="d-flex align-items-center">
                                {count === 18 ? (
                                    <img src={person} alt="이원준" className="img-fluid shadow-sm pointer"
                                         style={{width: 32, height: 32, objectFit: 'cover', borderRadius: '50%'}}/>
                                ) : (
                                    <img src={logo} alt="LC" className="img-fluid shadow-sm pointer"
                                         style={{width: 32, height: 32, objectFit: 'cover', borderRadius: '50%'}}
                                         onClick={e => setCount(count + 1)}/>
                                )}
                            </div>
                            <div>
                                {page !== 5 && page !== 0 ? (
                                    <h2 onClick={() => setPage(page + 1)} style={{cursor: 'pointer'}}><i
                                        className="fas fa-arrow-circle-right"/></h2>
                                ) : (
                                    <Fragment/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Apply;