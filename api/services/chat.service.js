const { Configuration, OpenAIApi } = require("openai");

class ChatService {
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.CHAT_SERVICE_API_ACCESS_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async sendMessage(conversation) {
    try {
      const systemMessage = {
        role: "system",
        content:
          "You are a travel agent who helps visitors find their ideal travel plans. \n\nIn the end, we would like to obtain information about the destination, departure city, start date, and end date of the trip. Please ask questions until you have gathered all the necessary information. \n\nmake sure that the destination and the departure are cities and not countries. Otherwise propose the city of the main international airport of the country and confirm with the client\n\nFinally, create a summary of the trip in the form of a bullet list, including the departure city, arrival city, start date, end date, and a suggested itinerary.",
      };

      conversation.unshift(systemMessage);
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: conversation,
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.data.choices[0].message;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ChatService;
