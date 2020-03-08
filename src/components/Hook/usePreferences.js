import React, {useEffect, useState} from "react";
import firebase from "firebase/app";
import "firebase/firestore";

const usePreferences = () => {
    const [preferencesLoading, setPreferencesLoading] = useState(true);
    const [preferences, setPreferences] = useState({
        active: true
    });

    useEffect(() => {
        const unsubscribe = firebase.firestore()
            .collection('preferences')
            .doc('apply')
            .onSnapshot(snapshot => {
                setPreferencesLoading(false);
                setPreferences(snapshot.data());
            });

        return () => unsubscribe();
    }, []);

    return {preferencesLoading, preferences};
};

export default usePreferences;