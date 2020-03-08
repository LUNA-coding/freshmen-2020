import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useToasts} from "react-toast-notifications";
import Apply from "../Apply";
import firebase from "firebase/app";
import "firebase/firestore";

const Edit = () => {
    const history = useHistory();
    const {addToast} = useToasts();

    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [check, setCheck] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setCheck(studentId !== '' && name !== '' && password !== '');
    }, [studentId, name, password]);

    const handleSubmit = async e => {
        e.preventDefault();

        const checkExist = await firebase.firestore().collection('applications')
            .where('studentId', '==', studentId)
            .where('name', '==', name)
            .where('password', '==', password)
            .get();

        if (checkExist.empty) {
            addToast('지원서를 찾을 수 없습니다. 입력한 정보가 정확한지 확인해주세요.', {appearance: 'error', autoDismiss: true});
        } else {
            setShow(true);
        }
    };

    return (
        show ? (
            <Apply userStudentId={studentId} userName={name} userPassword={password}/>
        ) : (
            <div className="container">
                <div className="row no-gutters">
                    <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3 d-flex align-items-center"
                         style={{height: '100vh'}}>
                        <div className="animated fadeInUp" style={{width: '100%'}}>
                            <div className="card border-0 shadow-lg" style={{borderRadius: 20}}>
                                <div className="p-4">
                                    <h2 className="text-center text-purple font-weight-bolder mb-5">지원서 확인</h2>
                                    <p className="font-weight-bold text-purple text-center">지원할 때 입력했던 정보를
                                        입력하세요.</p>
                                    <form onSubmit={handleSubmit}>
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <div className="form-group">
                                                    <label htmlFor="studentId">학번</label>
                                                    <input type="text" className="form-control"
                                                           id="studentId"
                                                           value={studentId}
                                                           onChange={e => setStudentId(e.currentTarget.value)}
                                                           placeholder="학번 ex) 1428"
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
                                                           required/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn">
                                                {check ? (
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
                                </div>
                            </div>

                            <div className="d-flex justify-content-between text-white p-3">
                                <div>
                                    <h2 onClick={() => history.push('/')} style={{cursor: 'pointer'}}><i
                                        className="fas fa-home"/></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
};

export default Edit;
