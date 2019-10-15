import { RTMClient } from '@slack/rtm-api';
import { WebAPICallResult, WebClient } from '@slack/web-api';
import * as express from 'express';

import { MessageEvent } from '../../_models/message-event';
import { displaySentience } from './sentience';

export class Zelem {
  private readonly token = process.env.ZELEM_SLACK_KEY;
  private wc = new WebClient(this.token);
  private rtm = new RTMClient(this.token);
  private channelsById = new Map<string, string>();
  private idsByChannel = new Map<string, string>();

  private currentQuestion: string = undefined;
  private currentMessage: string = undefined;
  private lastMessageUser: string = undefined;

  async start(app: express.Express): Promise<WebAPICallResult> {
    this.registerEndpoints(app);
    const { channels } = await this.wc.channels.list();

    (channels as any[]).forEach(channel => {
      this.channelsById.set(channel.id, channel.name);
      this.idsByChannel.set(channel.name, channel.id);
    });

    this.rtm.on('message', (message: MessageEvent) => {
      this.handleMessage(message);
    });

    displaySentience(this);

    return this.rtm.start();
  }

  async askQuestion(messageText: string) {
    if (this.messageIsInProgress()) {
      return;
    }

    const channel = this.idsByChannel.get('weegee');
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));

    this.currentQuestion = messageText;
    this.currentMessage = letter;

    await this.wc.chat.postMessage({
      channel,
      text: messageText,
    });

    await this.wc.chat.postMessage({
      channel,
      text: letter,
    });
  }

  private registerEndpoints(app: express.Express) {
    app.post('/zelem/goodbye', (req, res) => {
      this.tryGoodbye(req.body.user_id);

      res.send();
    });

    app.post('/zelem', (req, res) => {
      const question = req.body.text;

      if (typeof question === 'undefined' || (question as string).trim().length < 1) {
        return;
      }

      this.tryAsk(question);

      res.send();
    });
  }

  private tryAsk(question: string) {
    if (question.endsWith('?') && !this.messageIsInProgress()) {
      this.askQuestion(question);
    }
  }

  private tryGoodbye(user: string) {
    if (this.messageIsInProgress() && this.lastMessageIsNotFrom(user)) {
      this.sayGoodbye(user);
    }
  }

  private async handleMessage(message: MessageEvent): Promise<void> {
    if (this.messageIsFromABot(message)) {
      return;
    }

    if (this.messageIsComplete(message)) {
      await this.sayGoodbye(message.user);

      return;
    }

    if (this.messageIsDivine(message)) {
      if (this.messageIsInProgress() && this.lastMessageIsNotFrom(message.user)) {
        this.currentMessage = this.currentMessage.concat(message.text.toUpperCase());
        this.lastMessageUser = message.user;
      }

      return;
    }

    if (this.messageIsACallForWisdom(message)) {
      await this.askQuestion(message.text);
      return;
    }
  }

  private async sayGoodbye(byUser: string) {
    const channel = this.idsByChannel.get('weegee');

    const questionLastChar = this.currentQuestion.substr(-1);
    const promptHasPunctuation = questionLastChar === '.' || questionLastChar === '?';

    const regexTest = /_{2,}/; // Finds an underscore block ('____');
    const questionHasUnderscores = regexTest.test(this.currentQuestion);

    const outputText = questionHasUnderscores
      ? this.currentQuestion.replace(regexTest, `*${this.currentMessage}*`)
      : `${this.currentQuestion} *${this.currentMessage}*`;

    await this.wc.chat.postMessage({
      channel,
      text: `Zelem says: ${outputText}${!promptHasPunctuation && '.'} (Ended by <@${byUser}>)`,
    });

    this.currentMessage = undefined;
    this.currentMessage = undefined;
    this.lastMessageUser = undefined;
  }

  private lastMessageIsNotFrom(user: string): boolean {
    return this.lastMessageUser !== user;
  }

  private messageIsFromABot(message: MessageEvent) {
    return message.subtype === 'bot_message';
  }

  private messageIsACallForWisdom(message: MessageEvent) {
    return typeof this.channelsById.get(message.channel) === 'undefined' && message.text.endsWith('?');
  }

  private messageIsDivine(message: MessageEvent): boolean {
    return this.channelsById.get(message.channel) === 'weegee' && message.text.length === 1;
  }

  private messageIsInProgress(): boolean {
    return typeof this.currentMessage !== 'undefined' && this.currentMessage.length > 0;
  }

  private messageIsComplete(message: MessageEvent): boolean {
    return (
      this.messageIsInProgress() &&
      this.lastMessageIsNotFrom(message.user) &&
      message.text &&
      message.text.toLowerCase() === 'goodbye'
    );
  }
}
