const { Configuration, OpenAIApi } = require('openai');
const chatConfiguration = require('../../config/chat.configuration');
const FlightService = require('./flight.service');
const AccommodationService = require('./accommodation.service');
const TripService = require('../trip.service');
const { verifyObjectComplete } = require('../../utils/conversation');

class ChatService {
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.CHAT_SERVICE_API_ACCESS_KEY,
    });
    this.openai = new OpenAIApi(configuration);

    this.flightServiceInstance = new FlightService();
    this.accommodationServiceInstance = new AccommodationService();
    this.tripServiceInstance = new TripService();
  }

  sendByUser(message) {
    return { role: 'user', content: message };
  }
  sendByAssistant(message) {
    return { role: 'assistant', content: message };
  }
  async askToChatGPT(configuration, conversation = []) {
    try {
      const systemMessage = {
        role: 'system',
        content: configuration.systemMessage,
      };

      conversation.unshift(systemMessage);
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversation,
        temperature: configuration.temperature,
        max_tokens: configuration.maxTokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.data.choices[0].message;
    } catch (err) {
      throw err;
    }
  }
  async extractInfo(configuration, conversation) {
    try {
      const chatMl = [
        {
          role: 'user',
          content: `${configuration.inputType}:
        ${JSON.stringify(conversation)}

        ${configuration.entities ?? ''}`,
        },
      ];
      const response = await this.askToChatGPT(configuration, chatMl);
      console.log('ExtractInfo:', response);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async extractTripInfo(conversation) {
    try {
      const response = await this.extractInfo(chatConfiguration.extractTripInfo, conversation);
      const jsonResponse = JSON.parse(response.content);
      return {
        entities: jsonResponse,
        isComplete: verifyObjectComplete(jsonResponse),
      };
    } catch (err) {
      throw err;
    }
  }
  async extractSelection(conversation) {
    try {
      const lastMessage = conversation[conversation.length - 1].body.content;
      const response = await this.extractInfo(chatConfiguration.extractSelection, lastMessage);
      return Number(response.content);
    } catch (err) {
      throw err;
    }
  }
  async checkIfUserAgree(conversation) {
    try {
      const lastMessage = conversation[conversation.length - 1].body.content;
      const response = await this.extractInfo(chatConfiguration.detectPositiveSentiment, lastMessage);
      return response.content.toLowerCase() == 'true';
    } catch (err) {
      throw err;
    }
  }
}
module.exports = ChatService;
