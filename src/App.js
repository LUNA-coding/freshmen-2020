import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import {ToastProvider} from 'react-toast-notifications';
import ScrollToTop from 'react-router-scroll-top';
import Particles from "react-particles-js";
import Message from "./components/Utils/Message";
import useUser from "./components/Hook/useUser";

import * as ROUTES from "./constants/routes";

import Home from "./components/Home";
import Admin from "./components/Admin";
import Apply from "./components/Apply";
import Edit from "./components/Edit";
import Login from "./components/Login";
import Application from "./components/Application";


function App() {
    const {userLoading, isAdmin} = useUser();

    useEffect(() => {

    }, [userLoading, isAdmin]);

    return (
        <div>
            <Router>
                <ScrollToTop>
                    <ToastProvider autoDismissTimeout={3000}>
                        <Switch>
                            <Route path={ROUTES.HOME} exact>
                                <Home/>
                            </Route>
                            <Route path={ROUTES.APPLY} exact>
                                <Apply/>
                            </Route>
                            <Route path={ROUTES.EDIT} exact>
                                <Edit/>
                            </Route>
                            <Route path={ROUTES.LOGIN} exact>
                                <Login/>
                            </Route>
                            {!userLoading && isAdmin ? (
                                <Fragment>
                                    <Route path={ROUTES.ADMIN} exact>
                                        <Admin/>
                                    </Route>
                                    <Route path={ROUTES.APPLICATION}>
                                        <Application/>
                                    </Route>
                                </Fragment>
                            ) : (
                                <Redirect to={ROUTES.LOGIN}/>
                            )}
                        </Switch>
                        <Particles
                            className="canvas-wrapper"
                            canvasClassName="canvas"
                            params={{
                                "particles": {
                                    "number": {
                                        "value": 50
                                    },
                                    "size": {
                                        "value": 3
                                    }
                                },
                                "interactivity": {
                                    "events": {
                                        "onhover": {
                                            "enable": true,
                                            "mode": "repulse"
                                        }
                                    }
                                }
                            }}/>

                        <Message/>
                    </ToastProvider>
                </ScrollToTop>
            </Router>
        </div>
    );
}

export default App;
