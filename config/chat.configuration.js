const chatConfiguration = {
  mainConversation: {
    systemMessage: `You are a travel agent who help visitors to plan their trip. Your goal is to gather essential information about destination city, departure city, start date, end date and passengers number for the trip. Feel free to ask questions until all the necessary details are collected.
          Ensure that both the departure and destination are specified as cities and not countries. If the client hasn't provided a specific city, suggest the main international airport city and confirm it with the client.
          Once all the information is gathered, create a comprehensive summary of the trip. Finally, inquire whether the user would like you to search for the best flight options to enhance their travel experience.`,
    temperature: 1,
    maxTokens: 256,
  },
  extractTripInfo: {
    systemMessage: `Your task is to extract the following "Entities" from the below "Conversation" between an agent and a customer. Response should follow the "Output Format". If some entities are missing provide null in the "Output Format"`,
    temperature: 0,
    maxTokens: 100,
    inputType: 'Conversation',
    entities: `Entities:
    departureCity: This is the city where the trip will begin.
    departureCityIATA: This is the city where the trip will begin. Convert it to the IATA code.
    destinationCity: This is the city where the trip will end.
    destinationCityIATA: This is the city where the trip will end. Convert it to the IATA code.
    departureDate:  start date of the trip, format in YYYY-MM-DD, default year is 2023
    returnDate:  end date of the trip, format in YYYY-MM-DD, default year is 2023
    adultsNb: number of passengers

Output Format: {"departureCity":<departure city as a string>,"destinationCity":<destination city as a string>,"departureCityIATA": <IATA code of the departure city>, "destinationCityIATA" : <IATA code of the destination city>, "departureDate":<departure date or start date>,"returnDate":<return date or end date>,"adultsNb":<number of passengers in digits>}`,
  },
  detectPositiveSentiment: {
    systemMessage: `You will be provided with a short statement, and your task is to detect if sentiment is positive (true) or negative (false). Output format : true or false`,
    inputType: 'Statement',
    temperature: 0,
    maxTokens: 100,
  },
  /*
  askIfNeedAssistanceForFlight: {
    systemMessage: `You are a travel agent. Ask the user if they would like assistance in finding the best flight options for their trip. You are free to modify how you inquire. Do not include greeting.`,
    temperature: 1,
    maxTokens: 100,
    userMessage: "",
  },
  askIfNeedAssistanceForAccommodation: {
    systemMessage: `You are a travel agent. Ask the user if they would like assistance in finding the best accommodations for their trip. You are free to modify how you inquire. Do not include greeting.`,
    temperature: 1,
    maxTokens: 100,
    userMessage: "",
  },
  */
  extractSelection: {
    systemMessage: `You will be provided with a 'statement,' and your task is to extract the user's choice from it. If extracting the response is not possible, please return null. The expected output format should be the user's choice represented as a number`,
    temperature: 0,
    maxTokens: 100,
  },
  askIfNeedAssistanceForFlight: {
    systemMessage: 'Great ! Would you like me to help you find the best flight options for your trip?',
  },
  askIfNeedAssistanceForAccommodation: {
    systemMessage: 'Perfect ! Would you like me to help you find the perfect accommodations for your trip?',
  },
  askForSelection: {
    systemMessage: 'Please let me know which option would be most suitable for you?',
  },
  tellTripCreated: {
    systemMessage: 'Great ! Everything is ready ✅ Thank you for using our service 🙏 Your trip has been saved to your account ! Enjoy your hollidays ☀️ 🏄‍♂️ 🏖️ ',
  },
};

module.exports = chatConfiguration;
