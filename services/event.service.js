const FlightService = require('./api/flight.service');
const AccommodationService = require('./api/accommodation.service');
const TripService = require('./trip.service');
const ChatService = require('./api/chat.service');
const { interpret, State } = require('xstate');
const { waitFor } = require('xstate/lib/waitFor');
const { chatMachine } = require('../machine/chat.machine');

class EventService {
  constructor() {
    this.flightServiceInstance = new FlightService();
    this.accommodationServiceInstance = new AccommodationService();
    this.tripServiceInstance = new TripService();
    this.chatServiceInstance = new ChatService();
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
    if (userId) previousState.context.userId = userId;

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
