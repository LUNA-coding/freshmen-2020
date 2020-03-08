import React, {Fragment, useEffect, useState} from "react";
import ReactInterval from 'react-interval';

const Message = () => {
    const [index, setIndex] = useState(0);
    const messages = [
        {
            name: '서동하',
            content: '합격하면 봅시당'
        },
        {
            name: '서동휘',
            content: '유 캔 두 잇'
        },
        {
            name: '최희영',
            content: '꼭 루나 붙어서 저희랑 찜질방도 가고 치칵도 가고 막 놀아요!!! 계획은 이미 세워졌으니 몸만 챙겨오세요 헤헤'
        },
        {
            name: '김대운',
            content: '떨어질 것부터 걱정하지 말고 일단 지원 ㄱㄱ'
        },
        {
            name: '고윤서',
            content: '루나에 오면 정말 많은 것을 배울 수 있을 거예요! 다른 걱정 하지 말고 솔직하게 지원해봐요!!'
        },
        {
            name: '이원준',
            content: '누군가 루나의 미래를 묻거든 고개를 들어 너를 보게 하라.'
        },
        {
            name: '변경민',
            content: '얘들아 합격하면 아이스크림 쏠게ㅎㅎ 파이팅~!'
        },
        {
            name: '김수겸',
            content: '망설이면 후회할게 뻔합니다. 루나에서 봐요.'
        },
        {
            name: '박평진',
            content: '루나에 지원해주셔서 감사합니다. 붙을 수 있을 거예요 파이팅!'
        },
        {
            name: '김예빈',
            content: '루나에서 무언갈 얻었음 얻었지, 절대 잃지 않을거에요.'
        },
        {
            name: '김윤수',
            content: '15기..화석이..파릇파릇한..샌애긔들...기다리고있읍니다.....(˵ ͡° ͜ʖ ͡°˵)❤'
        },
        {
            name: '최혜진',
            content: '루나에서 하는것중에 면접이 제일 재밌을거에요 ㅎㅎ'
        },
        {
            name: '이가영',
            content: '루나에 오면 고인물 15기랑도 짱친될 수 이쒀요❣️'
        }
    ];

    const setRandomIndex = () => {
        const randomInt = Math.floor(Math.random() * messages.length);
        setIndex(randomInt);

        return randomInt;
    };

    useEffect(() => {
        setRandomIndex();
    }, []);

    return (
        <Fragment>
            <ReactInterval timeout={5000} enabled={true} callback={() => setRandomIndex()} />
            <div className="d-flex justify-content-center text-white fixed-bottom py-2">
                <h6 key={index + messages.length} className="font-weight-light animated flipInX mr-3">{messages[index].name}</h6>
                <h6 key={index} className="font-weight-light animated flipInX delay-1s">{messages[index].content}</h6>
            </div>
        </Fragment>
    );
};

export default Message;