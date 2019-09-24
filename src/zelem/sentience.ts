import axios from 'axios';
import shuffle = require('shuffle-array');

import { Zelem } from '.';
import { TotallyOriginalQuestion } from './original-question';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export async function displaySentience(zelem: Zelem) {
  let token: string;
  let questions: TotallyOriginalQuestion[] = [];

  const getToken = async () => {
    return (await axios.post('https://www.reddit.com/api/v1/access_token', 'grant_type=client_credentials', {
      auth: {
        password: process.env.ZELEM_REDDIT_SECRET,
        username: process.env.ZELEM_REDDIT_CLIENT_ID,
      },
    })).data.access_token as string;
  };

  const getOuijaNew = async () => {
    return await axios
      .get('https://oauth.reddit.com/r/AskOuija/new', {
        headers: { authorization: `Bearer ${token}` },
      })
      .catch(async () => {
        console.log('attempting to get new token.');
        token = await getToken();
        return getOuijaNew();
      });
  };

  const getQuestions = async () => {
    const rawPosts: any[] = (await getOuijaNew()).data.data.children;
    return shuffle(rawPosts.map(item => new TotallyOriginalQuestion({ title: item.data.title })));
  };

  const askQuestion = async () => {
    if (questions.length < 1) {
      console.log('Thinking of some thoughts.');
      questions = await getQuestions();
    }

    zelem.askQuestion(questions.pop().title);
  };

  await askQuestion();

  (function loop() {
    const delay = HOUR + Math.round(Math.random() * (100 * MINUTE));
    console.log(`Asking a question in ${delay}ms`);
    setTimeout(() => {
      askQuestion();
      loop();
    }, delay);
  })();
}
