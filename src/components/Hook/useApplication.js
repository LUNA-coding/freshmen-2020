import {useEffect, useState} from "react";
import firebase from 'firebase/app';
import 'firebase/firestore';

const useApplication = ({id = null, studentId = null, name = null, password = null}) => {
    const [applicationLoading, setApplicationLoading] = useState(true);
    const [application, setApplication] = useState({});
    const [applicationExist, setApplicationExist] = useState(false);

    useEffect(() => {
        if(id !== null) {
            const unsubscribe = firebase.firestore()
                .collection('applications')
                .doc(id)
                .onSnapshot(snapshot => {
                    setApplicationLoading(false);
                    if(snapshot.exists) {
                        setApplicationExist(true);
                        const major = parseInt(snapshot.data().studentId.slice(1, 2));
                        const grade = parseInt(snapshot.data().studentId.slice(0, 1));
                        setApplication({
                            id: snapshot.id,
                            ...snapshot.data(),
                            major: major===1?"EB":major===2?"DC":major===3||major===4?"WP":"HD",
                            grade: grade>3?4:grade,
                        });
                    } else {
                        setApplicationExist(false);
                        setApplication({});
                    }
                });

            return () => unsubscribe();
        } else if(studentId !== null && name !== null && password !== null) {
            const unsubscribe = firebase.firestore()
                .collection('applications')
                .where('studentId', '==', studentId)
                .where('name', '==', name)
                .where('password', '==', password)
                .onSnapshot(snapshot => {
                    console.log("data use");

                    if(!snapshot.empty) {
                        const newApplication = snapshot.docs.map(value => ({
                            id: value.id,
                            ...value.data()
                        }));

                        setApplicationLoading(false);
                        setApplication(newApplication[0]);
                        setApplicationExist(true);
                    } else {
                        setApplicationLoading(false);
                        setApplication({});
                        setApplicationExist(false);
                    }
                });

            return () => unsubscribe();
        } else {
            console.log("no data use");
            setApplicationLoading(false);
            setApplication({});
            setApplicationExist(false);
        }
    }, [name, password, studentId]);

    // console.log({applicationLoading, application, applicationExist});
    return {applicationLoading, application, applicationExist};
};

export default useApplication;