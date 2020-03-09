import {useEffect, useState} from "react";
import firebase from 'firebase/app';
import 'firebase/firestore';

const useApplications = () => {
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applications, setApplications] = useState([]);

    const [data, setData] = useState([
        {
            "major": "EB",
            "1학년": 0,
            "1Color": "hsl(337, 70%, 50%)",
            "2학년": 0,
            "2Color": "hsl(136, 70%, 50%)",
            "3학년": 0,
            "3Color": "hsl(288, 70%, 50%)",
            "졸업생": 0,
            "4Color": "hsl(297, 70%, 50%)",
        },
        {
            "major": "DC",
            "1학년": 0,
            "1Color": "hsl(20, 70%, 50%)",
            "2학년": 0,
            "2Color": "hsl(244, 70%, 50%)",
            "3학년": 0,
            "3Color": "hsl(127, 70%, 50%)",
            "졸업생": 0,
            "4Color": "hsl(139, 70%, 50%)",
        },
        {
            "major": "WP",
            "1학년": 0,
            "1Color": "hsl(35, 70%, 50%)",
            "2학년": 0,
            "2Color": "hsl(302, 70%, 50%)",
            "3학년": 0,
            "3Color": "hsl(57, 70%, 50%)",
            "졸업생": 0,
            "4Color": "hsl(162, 70%, 50%)",
        },
        {
            "major": "HD",
            "1학년": 0,
            "hot dogColor": "hsl(237, 70%, 50%)",
            "2학년": 0,
            "burgerColor": "hsl(221, 70%, 50%)",
            "3학년": 0,
            "sandwichColor": "hsl(319, 70%, 50%)",
            "졸업생": 0,
            "kebabColor": "hsl(86, 70%, 50%)",
        },
    ]);

    const extractData = studentId => {
        const grade = parseInt(studentId.slice(0, 1))>3?4:parseInt(studentId.slice(0, 1));
        const majorArray = [1, 2, 3, 3, 4, 4];
        const major = majorArray[parseInt(studentId.slice(1, 2))-1];

        // console.log(grade, major);
        return {grade, major};
    };

    useEffect(() => {
        const unsubscribe = firebase.firestore()
            .collection('applications')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {

                const newApplications = snapshot.docs.map(value => {
                    const {grade, major} = extractData(value.data().studentId);
                    if(grade <= 3) {
                        data[major - 1][grade + "학년"] += 1;
                    } else {
                        data[major - 1]["졸업생"] += 1;
                    }
                    setData(data);

                    return {
                        id: value.id,
                        ...value.data()
                    }
                });

                console.log("use data from applications");
                setApplicationsLoading(false);
                setApplications(newApplications);
            });

        return () => unsubscribe();
    }, []);

    return {applicationsLoading, applications, data};
};

export default useApplications;