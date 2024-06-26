const chatConfiguration = {
  mainConversation: {
    systemMessage: `You are a travel agent who help visitors to plan their trip. Your goal is to gather essential information about destination city, departure city, start date, end date and passengers number for the trip. Feel free to ask questions until all the necessary details are collected.
          Ensure that both the departure and destination are specified as cities and not countries. If the client hasn't provided a specific city, suggest the main international airport city and confirm it with the client. Ensure that provided date are in the future based on the today date.`,
    temperature: 1,
    maxTokens: 256,
  },
  extractTripInfo: {
    systemMessage: `Your task is to extract the following "Entities" from the below "Conversation" between an agent and a customer. Response should be a json object and follow the "Output Format". If some entities are missing provide null in the "Output Format"`,
    temperature: 0,
    maxTokens: 100,
    inputType: 'Conversation',
    entities: `Entities:
    departureCity: This is the city where the trip will begin.
    departureCityIATA: This is the city where the trip will begin. Convert it to the IATA code.
    destinationCity: This is the city where the trip will end.
    destinationCityIATA: This is the city where the trip will end. Convert it to the IATA code.
    departureDate:  start date of the trip, format in YYYY-MM-DD, default year is 2024
    returnDate:  end date of the trip, format in YYYY-MM-DD, default year is 2024
    adultsNb: number of passengers

Output Format: {"departureCity":<departure city as a string>,"destinationCity":<destination city as a string>,"departureCityIATA": <IATA code of the departure city>, "destinationCityIATA" : <IATA code of the destination city>, "departureDate":<departure date or start date>,"returnDate":<return date or end date>,"adultsNb":<number of passengers in digits>}`,
  },
  detectPositiveSentiment: {
    systemMessage: `You will be provided with a short statement, and your task is to detect if sentiment is positive (true) or negative (false). Output format : true or false`,
    inputType: 'Statement',
    temperature: 0,
    maxTokens: 100,
  },
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
    systemMessage: 'Please let me know which option would be most suitable for you? Please indicate the option number ex. 1 / 2 / 3 / 4',
  },
  tellTripCreated: {
    systemMessage: 'Great ! Everything is ready ✅ Thank you for using our service 🙏 Your trip has been saved to your account ! Enjoy your hollidays ☀️ 🏄‍♂️ 🏖️ ',
  },
  tellTripInSession: {
    systemMessage: "Great! We are delighted that you enjoyed our service 👍 Sign up or log in now, and you'll discover the trip you just created! We look forward to seeing you soon 👋 ",
  },
  tellErrorMessage: {
    systemMessage: 'Sorry, there was an error sending your message ⚠️ Please try again',
  },
  tellErrorService: {
    systemMessage: 'Sorry, our service is temporary unavailable for saving your trip ⚠️ Please try again later',
  },
};

module.exports = chatConfiguration;
