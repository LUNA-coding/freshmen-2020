import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import {useHistory} from "react-router-dom";
import useUser from "../Hook/useUser";
import firebase from "firebase/app";
import "firebase/auth";

const Login = () => {
    const {addToast} = useToasts();
    const history = useHistory();
    const {userLoading, isAdmin} = useUser();

    const [password, setPassword] = useState('');

    useEffect(() => {
        if(!userLoading && isAdmin) {
            history.replace('/admin');
        }
    }, [userLoading, isAdmin]);

    const handleSubmit = e => {
        e.preventDefault();

        firebase.auth().signInWithEmailAndPassword("admin@lunacoding.com", password).then(res => {
            // console.log(res.user);
            history.replace('/admin');
        })
            .catch(err => {
                addToast(err.message, {appearance: 'error', autoDismiss: true});
                console.error(err);
            });
    };

    return (
        <div className="container">
            <header className="py-5">
                <h1 className="font-weight-bold text-white">관리자 로그인</h1>
            </header>
            <div className="row">
                <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="card">
                        <div className="p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="password">관리자 비밀번호</label>
                                    <input id="password" type="password" className="form-control" placeholder="비밀번호"
                                           value={password} onChange={e => setPassword(e.currentTarget.value)}/>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">로그인</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;