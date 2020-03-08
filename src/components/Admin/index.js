import React, {Fragment, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useApplications from "../Hook/useApplications";
import usePreferences from "../Hook/usePreferences";
import {useToasts} from "react-toast-notifications";
import CountUp from "react-countup";
import Toggle from 'react-toggle';
import {ResponsiveBar} from "@nivo/bar";
import Loading from "../Utils/Loading";
import useUser from "../Hook/useUser";
import firebase from "firebase/app";
import "firebase/firestore";
import moment from "moment";

import "react-toggle/style.css"
import "./style.scss";


const Admin = () => {
    const {addToast} = useToasts();

    const {preferencesLoading, preferences} = usePreferences();
    const [active, setActive] = useState(true);

    const {applicationsLoading, applications, data} = useApplications();
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [search, setSearch] = useState('');

    const handleToggle = e => {
        e.preventDefault();
        const active = e.currentTarget.checked;
        firebase.firestore().collection('preferences').doc('apply').update({
            active
        })
            .then(() => {
                if(active) {
                    addToast('지원이 활성화 되었습니다.', {appearance: 'success', autoDismiss: true});
                } else {
                    addToast('지원이 마감되었습니다.', {appearance: 'success', autoDismiss: true});
                }
            });
    };

    useEffect(() => {
        if (!applicationsLoading) {
            setFilteredApplications(applications);
            setFilteredApplications(applications.filter(value => (value.studentId.includes(search) || value.name.includes(search) || value.contact.includes(search) || value.question1.includes(search) || value.question2.includes(search) || value.question3.includes(search))));
        }
        if(!preferencesLoading) {
            setActive(preferences.active);
        }
    }, [applications, applicationsLoading, preferences.active, preferencesLoading, search]);

    return (
        <div className="container">
            <header className="py-5">
                <h1 className="font-weight-bold text-white">관리자</h1>
            </header>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4 mb-md-5">
                        <div className="card-body">
                            <header className="p-3">
                                <h5>총 지원 : <CountUp end={applications.length}/>명</h5>
                            </header>

                            {applicationsLoading ? (
                                <div className="py-5">
                                    <Loading/>
                                </div>
                            ) : (
                                <div style={{height: 250}}>
                                    <ResponsiveBar
                                        data={data}
                                        keys={['1학년', '2학년', '3학년', '졸업생']}
                                        indexBy="major"
                                        margin={{top: 50, right: 130, bottom: 50, left: 60}}
                                        padding={0.3}
                                        colors={{scheme: 'nivo'}}
                                        defs={[
                                            {
                                                id: 'dots',
                                                type: 'patternDots',
                                                background: 'inherit',
                                                color: '#38bcb2',
                                                size: 4,
                                                padding: 1,
                                                stagger: true
                                            },
                                            {
                                                id: 'lines',
                                                type: 'patternLines',
                                                background: 'inherit',
                                                color: '#eed312',
                                                rotation: -45,
                                                lineWidth: 6,
                                                spacing: 10
                                            }
                                        ]}
                                        fill={[
                                            {
                                                match: {
                                                    id: '1학년'
                                                },
                                                id: 'dots'
                                            },
                                            {
                                                match: {
                                                    id: '3학년'
                                                },
                                                id: 'lines'
                                            }
                                        ]}
                                        borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                                        axisTop={null}
                                        axisRight={null}
                                        axisBottom={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: '과',
                                            legendPosition: 'middle',
                                            legendOffset: 32
                                        }}
                                        axisLeft={{
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legend: '지원수',
                                            legendPosition: 'middle',
                                            legendOffset: -40
                                        }}
                                        labelSkipWidth={12}
                                        labelSkipHeight={12}
                                        labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
                                        legends={[
                                            {
                                                dataFrom: 'keys',
                                                anchor: 'bottom-right',
                                                direction: 'column',
                                                justify: false,
                                                translateX: 120,
                                                translateY: 0,
                                                itemsSpacing: 2,
                                                itemWidth: 100,
                                                itemHeight: 20,
                                                itemDirection: 'left-to-right',
                                                itemOpacity: 0.85,
                                                symbolSize: 20,
                                                effects: [
                                                    {
                                                        on: 'hover',
                                                        style: {
                                                            itemOpacity: 1
                                                        }
                                                    }
                                                ]
                                            }
                                        ]}
                                        animate={true}
                                        motionStiffness={90}
                                        motionDamping={15}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="mb-4">
                        {preferencesLoading?(
                            <Fragment/>
                        ):(
                            <div className="d-flex align-items-center">
                                <Toggle
                                    id='apply-toggle'
                                    defaultChecked={true}
                                    checked={active}
                                    onChange={handleToggle}/>
                                {preferences.active?(
                                    <label className="text-white mb-0 ml-3" htmlFor='apply-toggle'>지원이 활성화 되어 있습니다.</label>
                                ):(
                                    <label className="text-white mb-0 ml-3" htmlFor='apply-toggle'>지원이 마감되었습니다.</label>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="card mb-4 mb-md-5">
                        <div className="p-5">
                            <header className="mb-5">
                                <h5>최근 지원</h5>
                            </header>

                            {applicationsLoading ? (
                                <div className="py-5">
                                    <Loading/>
                                </div>
                            ) : (
                                applications.slice(0, 3).map((value, index) => {
                                    const {studentId, name} = value;
                                    return (
                                        <div key={index}>
                                            {studentId} {name}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-5">
                <div className="p-5">
                    <header className="d-flex justify-content-between mb-5">
                        <h5>지원자 명단</h5>
                        <Link className="btn btn-sm btn-primary" to={'/'}>전체 지원서 보기 <i
                            className="fas fa-caret-right ml-2"/></Link>
                    </header>

                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="검색 (학번, 이름, 연락처 등)"
                                   value={search} onChange={e => setSearch(e.currentTarget.value)}/>
                        </div>
                    </form>

                    <div style={{overflowX: 'scroll'}}>
                        <table className="table" style={{minWidth: 600}}>
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>학번</th>
                            <th>이름</th>
                            <th>연락처</th>
                            <th>날짜</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applicationsLoading ? (
                            <tr>
                                <td colSpan={6}>
                                    <Loading/>
                                </td>
                            </tr>
                        ) : (
                            filteredApplications.map((value, index) => {
                                const {id, studentId, name, contact, createdAt} = value;
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{studentId}</td>
                                        <td>{name}</td>
                                        <td>{contact}</td>
                                        <td>{moment(createdAt.toDate()).format("YYYY-MM-DD HH:mm")}</td>
                                        <td>
                                            <Link className="btn btn-primary btn-sm" to={`/application/${id}`}>
                                                지원서 보기 <i className="fas fa-caret-right ml-2"/>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;