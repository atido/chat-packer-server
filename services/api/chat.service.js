const { Configuration, OpenAIApi } = require('openai');
const chatConfiguration = require('../../config/chat.configuration');
const { createMachine, interpret } = require('xstate');
const { waitFor } = require('xstate/lib/waitFor');
const FlightService = require('./flight.service');
const AccommodationService = require('./accommodation.service');
const TripService = require('../trip.service');
const { addContentToConversation, verifyObjectComplete, isNull } = require('../../utils/conversation');

class ChatService {
  constructor() {
    this.stateMachine = createMachine(
      {
        /** @xstate-layout N4IgpgJg5mDOIC5QGEAWBDALgBXQYwGswAnAWX1QEsA7MAOgHV1LMaoAxAe2IBVjKADgElqAM04BiUgFEAyrICCAcWkBtAAwBdRKAGdYLSp2o6QAD0QB2AGwBOOtYCMAZnXPLj9bfcBWADQgAJ6IALT2ABwALOExturWluoATEk+4c4AvhkBaFi4hCTkeFS0dHyCIuLInAA2NWB4mJASEMb0NABunER0nd1gIQC2UBAE6hraSCB6BqzGphYI9m7OSW6OqQHBCD7JdIk+SZ7Okc5OlpnZILk4+ERkFDT05cJinNV1DU0QLW291F0en0iEMRmNVI5Jrp9IZ5lNFo4onQfJFPJEkrZIj5rEc3FtEM5wkk6ISEo5bNZ3I4fNisjkMLcCg9ik8yvxXlVavVGs0SMRuHQBDUsOJiIN-oCBsNRuMtKYZrCTPDEI5qY46Op1D5bNijuEbHigqFCXQYpZLElrIcjtYVj46dcGfl7kUSvQAHJgSCkbhgAAiYEwzBqsF+pWB7QB-RC4TMeAArrKodMYXMlaBFs5vHRbFFIslVvFcc58QgktE6OXbLn3BacUkLg6bs7Co9Sp7vb6A0HKCGJHyBUKRdxxRGY3HExN5amjOnzATs7nIvmkoWccdS2t1PtItWdYjV6rLvS8ndWyzSuwapQoKhMApYAZYEHqHh6AAlMAAR3jcFY1CgB8nxfN8pDkRQVCnKYFTTBZEDsZx9nCDZIg8bVzlsUsrW3LdDkcSxonRE4mydM9mTdOgrxvO8gMoZ90Ffeg0AaAg2E-IVAjDSNJQlaMzHUAArMwoCg6FZlnOCEA2dRLDoXdqxpXF1EcaIsNtSsszSSwohkyx7SuZsyNdVkqNve9HzokCmNQFi2LADiuN4oEoxBfihJEyFp3EuEMxVdRUMrcJqyScItNtEsjQQILIgcfUfGpKJkMiK0SNPJljMva8zNo+jGLoWQwHQYgLygRyIycgZ0H4zBAlElNvLnBFtO3fVd3UIKnEcSkIu2HEYq6lToizDwtXCVLGRdNt6FMmiLNyt9GGYf8OG4AruTTMD5GUNQ5WgmcfPnMtnGcHxTRSDYfAtZLd2sLC0hzeLqX82wQu68aW3Ikystm4CGIW5jCDYNavlnMqXO46MfAIQJrBqOqYIk5UjvwuTLspTw3HilJS1zdV8K1OJ83auJ9JPCbzwombzN+vKAdYgDgcaUHWnDcGKpCKGYbhzy9oayTy3cSt8ISLxNWcFTLFLbFt10hI2pSHV3qMqa6AUPA8E4QZBk4CAsFnHKrLoT8fz-NgDb+sBNognbkwRg7FnCSkNROAbtR8E7l1LFwaX2YnDk1LrLFzJX0pVtWNa1nW9eMc3aZswGAPYmpOJZiHnMlEJRGcARLBE3axMVSSXCDklkusZdc386xQq9s5ToI8JlMbzF1mPR00smi96HDzXtd1tNY-++P6agJOU7+cqxyznOPNt-bGpVDFtx1NGsXcLx-EihL+vLmwsy6pxMRDzuKJ7yP+-1ubDYKoqSrBnix3CL9BkiSh4fn-mtWsHdyz07xbRkpEWu4sSSInFvEIKiJFYGVIqHLuqt1a9yjgPK+FtFqGAAlwYgjMNoyC2pBfO9VC5I1SKsOSw1UIS3drXdEGojhYhksdeIjhj4U1ZGfPu0dqCD2srZBmYB1rMwnmzMcnNLBw0IXbBeZZCZ0A2K4EK6JkobC9mhEkhJjgGjOEfGBHc2GlA4cgy+NMh58KgDgoRrMH7gw5tDcREI558xIchYkCRtSWhREHBsXtyx43JOhd2GIMRjV0eTT6pRZDoA6GwF499+js05uECRjjiG+SkuidU5ZdhEmiFXGuW8oiIVzLmauXV8w4n0lcagOs4CmEMnAt0XlUmHRCCaCkCQKRxVLCEDY39CTmg8edcKkRWHhPoEwDBK1eDskqJwJpsEkbkhlikG0Qdq56R8aac0CQTirFsOaVElhRkZWeDMt4Hx1qQHmYjNJnhQrIgxFmKk+pwqbi8DmbwLgQqHHSO045KsOwQB9MQf0gZgzwF5s0xYaN9iJF2V4O55JSzi2-uiK0nz+n4RGaEj6JzKLfWppZC21z7YEmxA4XUjcrSHHio7UsqFiSXRsAROICtdht3qSfL61FCXzQ-N+X8z4zaoMYiS6R+YYpWhxFSxStLbqRXLvYYpaQziIm0o7f58CqY8LoHTOyHExWSX1LJcpq4aQUjWDSLCu4cxBRVU4fUMRrCaspgSnVN9iolCgIaxZqFv7KRpPFBI+odSYQVSdfYmlCm2iODYF13LsoioWhM5aWCLEHSkZ-ZcWzyTVmpARLwQCFUeFNKib2lpynERxcrLVbqk28ITuYgRIMM0fxIdqGKr1EgeFCq4E41qlV2qJEcDEqIkjxoMYg8+XCeE+rSaiZYLs1ldK3tSRCh8Al7OCRO7uU7OEoJMfyk2QqAKzshQs+dCRnaHM6RsreJxTrVkbmLOI5JsVk1xWHPdRiY71t1cPfVyc52HTRN-dFT11iYiRfen2u5G4uH1GsLEO6EER33cYoleUPUlWAwibCqNbSB1+dYauNDMm5JUk4E4BEUOGIvr+w96DU2rWbUzVtTi0mHnVM1J18UzgXE3tsFw5cdzwazI3U4XVaPfvo9wv9er+GCPY1CxADYbAanRquW0cUoi1xRDmE6fGN7pBSChyJ0SAIvFwyqM4MVMbUgqaoshZxkLlyLKTduYS8XSGoBAAA8qIaoAISCwC4dZqSWZtxuO0hdL2OoZbIVzI7REhxkNZAyEAA */
        id: 'ChatPackerMachine',
        initial: 'WaitingForTripInfo',
        context: {
          tripInfo: null,
          conversation: null,
          response: null,
          message: null,
          flightIds: null,
          accommodationIds: null,
        },
        states: {
          WaitingForTripInfo: {
            on: {
              MESSAGE: {
                target: 'TripInfoCollected',
                actions: 'saveConversation',
              },
            },
          },

          TripInfoCollected: {
            invoke: {
              src: 'extractTripInfo',
              id: 'invoke-mgdk0',

              onDone: [
                {
                  target: '#ChatPackerMachine.FlightAssistance.RequestingAssistance',
                  cond: 'isComplete',
                  actions: 'collectTripInfo',
                },
                {
                  target: 'NeedMoreDetails',
                },
              ],

              onError: {
                target: 'WaitingForTripInfo',
                actions: 'collectError',
              },
            },
          },

          NeedMoreDetails: {
            invoke: {
              src: 'sendConversation',
              id: 'invoke-8xcu0',
              onDone: [
                {
                  target: 'WaitingForTripInfo',
                  actions: 'collectResponse',
                },
              ],
              onError: [
                {
                  target: 'WaitingForTripInfo',
                },
              ],
            },
          },

          FlightAssistance: {
            initial: 'RequestingAssistance',
            states: {
              RequestingAssistance: {
                entry: 'askToUserFlightAssistance',
                on: {
                  MESSAGE: {
                    target: 'CheckingReply',
                    actions: 'saveConversation',
                  },
                },
              },

              CheckingReply: {
                invoke: {
                  src: 'checkIfUserAgree',
                  id: 'invoke-x0jxg',
                  onDone: [
                    {
                      target: 'Searching',
                      cond: 'isOK',
                    },
                    {
                      target: '#ChatPackerMachine.AccommodationAssistance.RequestingAssistance',
                    },
                  ],
                },
              },

              Searching: {
                invoke: {
                  src: 'searchFlights',
                  id: 'invoke-ax0ty',
                  onDone: {
                    target: 'WaitingForSelection',
                    actions: ['collectResponse'],
                  },
                },
              },

              WaitingForSelection: {
                on: {
                  MESSAGE: {
                    target: 'CheckingSelection',
                    actions: 'saveConversation',
                  },
                },
              },

              CheckingSelection: {
                invoke: {
                  src: 'extractSelection',
                  id: 'invoke-5ky6l',

                  onDone: [
                    {
                      target: '#ChatPackerMachine.AccommodationAssistance.RequestingAssistance',
                      cond: 'isSelectionFlightOK',
                      actions: 'saveFlightSelection',
                    },
                    { target: '#ChatPackerMachine.FlightAssistance.Searching' },
                  ],
                },
              },
            },
          },

          AccommodationAssistance: {
            initial: 'RequestingAssistance',
            states: {
              RequestingAssistance: {
                on: {
                  MESSAGE: {
                    target: 'CheckingReply',
                    actions: 'saveConversation',
                  },
                },

                entry: 'askToUserAccommodationAssistance',
              },

              CheckingReply: {
                invoke: {
                  src: 'checkIfUserAgree',
                  id: 'invoke-f3p7g',
                  onDone: [
                    {
                      target: 'Searching',
                      cond: 'isOK',
                    },
                    {
                      target: '#ChatPackerMachine.SavingTrip',
                    },
                  ],
                },
              },

              Searching: {
                invoke: {
                  src: 'searchAccommodations',
                  id: 'invoke-8qm4i',
                  onDone: {
                    target: 'WaitingForSelection',
                    actions: ['collectResponse'],
                  },
                },
              },

              WaitingForSelection: {
                on: {
                  MESSAGE: {
                    target: 'CheckingSelection',
                    actions: 'saveConversation',
                  },
                },
              },

              CheckingSelection: {
                invoke: {
                  src: 'extractSelection',
                  id: 'invoke-5ky7l',
                  onDone: [
                    {
                      target: '#ChatPackerMachine.SavingTrip',
                      cond: 'isSelectionAccommodationOK',
                      actions: 'saveAccommodationSelection',
                    },
                    { target: '#ChatPackerMachine.AccommodationAssistance.Searching' },
                  ],
                },
              },
            },
          },

          SavingTrip: {
            invoke: {
              src: 'createTrip',
              id: 'invoke-5ky8l',
              onDone: [
                {
                  target: 'EndOfConversation',
                  actions: 'tellTripCreated',
                },
              ],
            },
          },

          EndOfConversation: {
            type: 'final',
          },
        },
        predictableActionArguments: true,
        preserveActionOrder: true,
      },
      {
        actions: {
          saveConversation: (context, event) => {
            context.conversation = event.conversation;
          },
          collectTripInfo: (context, event) => {
            console.log(context, event);
            context.tripInfo = event.data.entities;
          },
          collectResponse: (context, event) => {
            context.response = event.data;
          },
          collectError: (context, event) => {
            context.response = 'error occured';
          },
          askToUserFlightAssistance: (context, event) => {
            context.response = addContentToConversation(context.conversation, this.askToUser(chatConfiguration.askIfNeedAssistanceForFlight), 'thread');
          },
          askToUserAccommodationAssistance: (context, event) => {
            context.response = addContentToConversation(context.conversation, this.askToUser(chatConfiguration.askIfNeedAssistanceForAccommodation), 'thread');
          },
          saveFlightSelection: (context, event) => {
            context.tripInfo.flight = context.flightIds[event.data - 1];
          },
          saveAccommodationSelection: (context, event) => {
            context.tripInfo.accommodation = context.accommodationIds[event.data - 1];
          },
          tellTripCreated: (context, event) => {
            context.response = addContentToConversation(context.conversation, this.askToUser(chatConfiguration.tellTripCreated), 'thread');
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
            return addContentToConversation(context.conversation, this.askToUser(chatConfiguration.askForSelection), 'thread');
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
            return addContentToConversation(context.conversation, this.askToUser(chatConfiguration.askForSelection), 'thread');
          },
          createTrip: (context, event) => {
            return this.tripServiceInstance.createTrip('64af06df1a5fd4904ed2ff44', context.tripInfo, context.tripInfo.flight, context.tripInfo.accommodation);
          },
          sendConversation: (context, event) => {
            return this.sendConversation(context.conversation);
          },
          extractTripInfo: (context, event) => {
            return this.extractTripInfo(context.conversation);
          },
          extractSelection: (context, event) => {
            return this.extractSelection(context.conversation);
          },
          checkIfUserAgree: (context, event) => {
            return this.checkIfUserAgree(context.conversation);
          },
        },
        guards: {
          isComplete: (context, event) => event.data.isComplete,
          isOK: (context, event) => event.data,
          isSelectionFlightOK: (context, event) => {
            console.log(event.data);
            return !isNull(event.data) && event.data <= context.flightIds.length;
          },
          isSelectionAccommodationOK: (context, event) => {
            return !isNull(event.data) && event.data <= context.accommodationIds.length;
          },
        },
      }
    );

    const configuration = new Configuration({
      apiKey: process.env.CHAT_SERVICE_API_ACCESS_KEY,
    });
    this.openai = new OpenAIApi(configuration);

    this.stateMachineService = interpret(this.stateMachine)
      .onTransition(state => {
        console.log('Current State:', state.value);
        console.log('Response:', state.context?.response);
      })
      .start();
    this.flightServiceInstance = new FlightService();
    this.accommodationServiceInstance = new AccommodationService();
    this.tripServiceInstance = new TripService();
  }

  askToUser(configuration) {
    return { role: 'assistant', content: configuration.systemMessage };
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

  async sendConversation(conversation) {
    try {
      const chatMl = conversation.filter(el => el.component == 'thread').map(el => el.body);

      const response = await this.askToChatGPT(chatConfiguration.mainConversation, chatMl);
      return addContentToConversation(conversation, response, 'thread');
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
      return await this.askToChatGPT(configuration, chatMl);
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

  async events(type, conversation) {
    this.stateMachineService.send({ type, conversation });

    await waitFor(this.stateMachineService, state => state.context.response || state.done);
    const response = this.stateMachine.context.response;
    //set response to null for next call
    this.stateMachine.context.response = null;
    return response;
  }
}
module.exports = ChatService;
