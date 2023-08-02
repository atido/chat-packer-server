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

  async events(type, message) {
    this.stateMachineService.send({ type, message });

    await waitFor(this.stateMachineService, state => state.hasTag('pause') || state.done);
    return this.stateMachine.context.conversation;
  }
  async asyncInterpret(machine, msToWait, initialState, initialEvent) {
    const service = interpret(machine);
    service.start(initialState);
    if (initialEvent) {
      service.send(initialEvent);
    }
    return await waitFor(service, state => state.hasTag('pause') || state.done, { timeout: msToWait });
  }
  async loadStateMachine() {
    //const stateConfig = await readCookie(request);
    //if state in session => load from session and return
    //const chatMachineState = await this.asyncInterpret(chatMachine, 10_000);
    //save state in session and return
  }

  async create(event) {
    //const stateConfig = await readCookie(request);
    // Convert cookie into machine state
    // const currentState = await chatMachine.resolveState(State.create(stateConfig));
    //const transitionState = await this.asyncInterpret(chatMachine, 10_000, currentState, event);
  }
}

module.exports = EventService;
