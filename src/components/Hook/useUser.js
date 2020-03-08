import React, {useEffect, useState} from "react";
import firebase from "firebase/app";
import "firebase/auth";

const useUser = () => {
    const [userLoading, setUserLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                setUserLoading(false);
                setIsAdmin(true);
            } else {
                setUserLoading(false);
                setIsAdmin(false);
            }
        });
    }, []);

    return {userLoading, isAdmin};
};

export default useUser;