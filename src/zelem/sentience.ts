import axios from 'axios';
const shuffle = require('shuffle-array');

import { TotallyOriginalQuestion } from './original-question';


const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export async function displaySentience(ask?: (string) => Promise<void>) {
    let token: string;
    let questions: TotallyOriginalQuestion[] = [];

    const getToken = async () => {
        return (await axios.post('https://www.reddit.com/api/v1/access_token', 
            "grant_type=client_credentials",
            { 
                auth: { 
                    username: process.env.ZELEM_REDDIT_CLIENT_ID,
                    password: process.env.ZELEM_REDDIT_SECRET
                },
            })).data.access_token as string;
    };

    const getOuijaNew = async () => {
        return await axios.get('https://oauth.reddit.com/r/AskOuija/new', {
            headers: { 'authorization': `Bearer ${token}`}
        }).catch(async () => {
            console.log('attempting to get new token.');
            token = await getToken();
            return getOuijaNew();
        });
    };

    const getQuestions = async () => {
        const rawPosts: any[] = (await getOuijaNew()).data.data.children
        return shuffle(rawPosts.map(item => new TotallyOriginalQuestion({ title: item.data.title })));
    }

    const askQuestion = async () => {
        if (questions.length < 0) {
            questions = await getQuestions();
        }

        ask(questions.pop());
    };

    await askQuestion();

    (function loop() {
        const delay = HOUR + Math.round((Math.random() * (100 * MINUTE)));
        console.log(`Asking a question in ${delay}ms`);
        setTimeout(function() {
                askQuestion()
                loop();  
        }, delay);
    }());
}
