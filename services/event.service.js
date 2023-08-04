const FlightService = require('./api/flight.service');
const AccommodationService = require('./api/accommodation.service');
const TripService = require('./trip.service');
const ChatService = require('./api/chat.service');
const chatConfiguration = require('../config/chat.configuration');
const { interpret, State } = require('xstate');
const { waitFor } = require('xstate/lib/waitFor');
const { chatMachine } = require('../machine/chat.machine');
const { addContentToConversation, isNull } = require('../utils/conversation');
const initMessages = require('../data/chat.init.json');

class EventService {
  constructor() {
    this.flightServiceInstance = new FlightService();
    this.accommodationServiceInstance = new AccommodationService();
    this.tripServiceInstance = new TripService();
    this.chatServiceInstance = new ChatService();
    this.stateMachine = chatMachine.withConfig({
      actions: {
        initConversation: (context, event) => {
          if (!context.conversation.length)
            initMessages.forEach(message => (context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(message), 'thread')));
        },
        saveMessage: (context, event) => {
          context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByUser(event.message), 'thread');
        },
        collectTripInfo: (context, event) => {
          context.tripInfo = event.data.entities;
        },
        askToUserFlightAssistance: (context, event) => {
          context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.askIfNeedAssistanceForFlight.systemMessage), 'thread');
        },
        askToUserAccommodationAssistance: (context, event) => {
          context.conversation = addContentToConversation(
            context.conversation,
            this.chatServiceInstance.sendByAssistant(chatConfiguration.askIfNeedAssistanceForAccommodation.systemMessage),
            'thread'
          );
        },
        saveFlightSelection: (context, event) => {
          context.tripInfo.flight = context.flightIds[event.data - 1];
        },
        saveAccommodationSelection: (context, event) => {
          context.tripInfo.accommodation = context.accommodationIds[event.data - 1];
        },
        tellErrorMessage: (context, event) => {
          context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.tellErrorMessage.systemMessage), 'thread_error');
        },
        tellErrorService: (context, event) => {
          context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.tellErrorService.systemMessage), 'thread_error');
        },
        logError: (context, event) => {
          console.log(event.data);
        },
      },
      services: {
        searchFlights: async (context, event) => {
          const responseFromApi = await this.flightServiceInstance.searchFlights(
            context.tripInfo.adultsNb,
            context.tripInfo.departureCityIATA,
            context.tripInfo.destinationCityIATA,
            context.tripInfo.departureDate,
            context.tripInfo.returnDate
          );
          context.flightIds = responseFromApi.map(el => el._id);
          context.conversation = addContentToConversation(context.conversation, responseFromApi, 'flightCardGroup');
          context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.askForSelection.systemMessage), 'thread');
        },
        searchAccommodations: async (context, event) => {
          const responseFromApi = await this.accommodationServiceInstance.searchAccommodations(
            context.tripInfo.destinationCity,
            context.tripInfo.departureDate,
            context.tripInfo.returnDate,
            context.tripInfo.adultsNb
          );
          context.accommodationIds = responseFromApi.map(el => el._id);
          context.conversation = addContentToConversation(context.conversation, responseFromApi, 'accommodationCardGroup');
          context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.askForSelection.systemMessage), 'thread');
        },
        createTrip: async (context, event) => {
          const trip = await this.tripServiceInstance.createTrip(context.userId, context.tripInfo, context.tripInfo.flight, context.tripInfo.accommodation);
          if (context.userId) {
            // user is connected -> the trip has been saved and attached to him
            context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.tellTripCreated.systemMessage), 'thread');
          } else {
            // user is not connected -> the trip has been saved but not attached to him so saved for further login
            context.tripCreatedId = trip._id;
            context.conversation = addContentToConversation(context.conversation, this.chatServiceInstance.sendByAssistant(chatConfiguration.tellTripInSession.systemMessage), 'thread');
          }
          context.conversation = addContentToConversation(context.conversation, '', 'endButtons');
        },
        sendConversationToChatGPT: async (context, event) => {
          const filteredConversation = context.conversation.filter(el => el.component == 'thread').map(el => el.body);
          const bodyResponse = await this.chatServiceInstance.askToChatGPT(chatConfiguration.mainConversation, filteredConversation);
          context.conversation = addContentToConversation(context.conversation, bodyResponse, 'thread');
        },
        extractTripInfo: (context, event) => {
          return this.chatServiceInstance.extractTripInfo(context.conversation);
        },
        extractSelection: (context, event) => {
          return this.chatServiceInstance.extractSelection(context.conversation);
        },
        checkIfUserAgree: (context, event) => {
          return this.chatServiceInstance.checkIfUserAgree(context.conversation);
        },
      },
      guards: {
        isComplete: (context, event) => event.data.isComplete,
        isOK: (context, event) => event.data,
        isSelectionFlightOK: (context, event) => {
          return !isNull(event.data) && event.data <= context.flightIds.length;
        },
        isSelectionAccommodationOK: (context, event) => {
          return !isNull(event.data) && event.data <= context.accommodationIds.length;
        },
      },
    });
  }

  async events(event, session, userId) {
    try {
      const stateDefinition = session.content.currentState || this.stateMachine.initialState;
      const currentState = await this.asyncInterpret(session.id, this.stateMachine, 10_000, stateDefinition, event, userId);

      if (currentState.done) {
        //add trip in session if there is one
        if (currentState.context.tripCreatedId) session.content.tripCreatedId = currentState.context.tripCreatedId;
        //remove state in session for next trip
        session.content.currentState = null;
      } else {
        session.content.currentState = currentState;
      }
      return currentState.context.conversation;
    } catch (err) {
      console.log(err);
    }
  }
  async asyncInterpret(sessionId, machine, msToWait, initialStateDefinition, initialEvent, userId) {
    const previousState = State.create(initialStateDefinition);
    previousState.context.userId = userId;

    const service = interpret(machine)
      .start(previousState)
      .onTransition(state => {
        console.log('Session ID :', sessionId, 'Current State:', state.value);
      });
    if (initialEvent) service.send(initialEvent);

    return await waitFor(service, state => state.hasTag('pause') || state.done, { timeout: msToWait });
  }
}

module.exports = EventService;
