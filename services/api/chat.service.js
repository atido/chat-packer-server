const { Configuration, OpenAIApi } = require('openai');
const chatConfiguration = require('../../config/chat.configuration');
const { createMachine, interpret } = require('xstate');
const { waitFor } = require('xstate/lib/waitFor');
const FlightService = require('./flight.service');
const AccommodationService = require('./accommodation.service');
const { addContentToConversation, verifyObjectComplete, isNull } = require('../../utils/conversation');

class ChatService {
  constructor() {
    this.stateMachine = createMachine(
      {
        /** @xstate-layout N4IgpgJg5mDOIC5QGEAWBDALgBXQYwGswAnAWX1QEsA7MAOgEkIAbMAYlIFEBlbgQQDinANoAGALqJQABwD2sSpkqzqUkAA9EAdgAsATjp6ATAEYAHFoCsZgGxHRRgDQgAnohMmDNnZ9F67AMxaWh4mAL5hzmhYuIQk5HhUtHQAKsSU0gzUAGayyLLMrHiYkGwQKvQ0AG6yRHTVtWAAtAC2UBAEomKSSCByCkoqapoIBqIBAfYBJkaWzm4Ilg50WqKWpuM6ATYmWgERURg4+ERkFDT0aRlZufmFYMWl5ckNda-NbR1dJj0y8orKVS9EYBMwBQxmHQ6ByTUR2EzjeaIMwmOhLUQY0RmCwmSx4swHEDRY5xM6JC6pdKZHJ5ApFEoQNgkYiyYh0aTMLC5YgterUGpEVrtTrdNT9AFDYHuHRGOiiHy6Sx6HRaYyeMxIhDbMyGXYooxGMF7IyE4mxU4JJL0AByYEgpFZYAAImBMOhKMxYGUKnyBZV+Y0mmZ1HgAK5dCRi-6DIGgEF6cF6SHQoyw+GI1yIIw6HXZvRJoJaIx2Ix7U1Hc3xc7JW32x0ut0er3M1nszmYbm895BkPh0W9cUx4aIAIJiFQmH2dMBTX2UQrfT5yzmVMefaRIkVk5V8nJABizEoUFQmD4sAUsDd1Dw9AASmAAI6huBKahQM8Xq83jg8fhCft-AMgLDggNhjlo+oqri-i7Homo2EsdBzusuw5jKAQ6OWMTbmSVp0AeR4nh+lCXug170GgDwEDQUD3hyLjei8AZvMxzTqKIABW6hQABfTRsBUoIDMohaHQi56HiGyiCYObwTY86phJFiQiJVhYSSFrVvQBHHqe54kV+FGoFRNF0cwDHPP6fq+oG7FcTxPxRkBkpxu48qiYa+aGtYWjyTOmYIGYyp0DYFjLtYOYyQh6mVrhFI6UR+mkeRdDcGA6DELuUCMVZjQ2YK6DsZgLi8YOAmuUJEHzhY+hYjBJg2BM8HZnQDUyTmo4hGsBIbmaOGWvFh66cRyU3nQADq7qvlAe6sml9KAj+vCCCIkYDvxLkaFmEyWHQZgGjMlhFjo3j+PB1iGMuuLysYtgTDF-VafhQ2JZ+ZFjZRhA0fNDwxjl+W5YKlgEC4NjMKVG2xltCCrqJOhHY1CLjMuBqakmqK7GsejyhiQVrA9pIDfuL16W9KWfdRb4-cUi2WQDANNMDoPg4563OVDIzZkESG7DYqzY+MMlaJqljyXKwR87VBoSQTmm7vQfB4HgsgtC0sgQFggIjYZdD3k+L40dr73sFwy3-mtgEShz2iQisNjyRJ5h6AiUKaiYGE2Gi2P29YoW2GWvVboTT2K8rqvq5rKhG+TxlfW+ZkWT67wM9kATSFoPEW3x7Mge70ni2YR2F7opiF27ASiyFRh6Hsng7KXPWHNhwfy3Qocq2rGsxtHH2x5TtFgPR-3J92qfpw5vzZ1buel4YyrWJ53jCwFMnLis7shD4HgJiagfN3LeHt+HXda0lOtpRlWXD6xDNmA+LQ6JQEM54JngQWJujQhJ1dWLo5cGkhTE2Y8SNWCLLHch8lYdwjt3M+xsJpTRorNYg1M-qmz-KtSeZVNqc3hjoVqIRQoiR8IacukxDCC28PJBwOYbDgLiskI+ndI7UB7kZEyVMwALRUNfay3YmZaHBlnbB1sYb5nwcqcwvksRYjsG7eGqIQhBBkqEHe9CiYKygcfFhbC6AU2+lw36tMk4334SDQRwhWaWyHIJUsGExIiVsNJHwfNl4LBmOQjE7sXZeN2OuDc1B1ZwDUH1FuVonLT0Ek0UEhh7aqlClYTUTRPaYkxFvFEJ0PDqKekwVgESbEVQap7Sw0xiylmsIXNYTgV4yjoNqFUphUzBCyXvDSECKRXGpLcOkv1ID5PKtDBEhc0TV1HMoiwflZx+DntMSYhdDSjnttk1utYIAOmIM6V07pPT9JwYgBGKxVgYQCH4IZnhNTTE9jKBCCZ3Y4l0MsvCCVSYGWNrs0RFdPYITsGYOEklly2E1A0tEEs9h+UmDmSwjzBqEReaNO8j5nyXkNnA8i7yQLQnwd8w0fz1gApsPBfQEIlLbCkdiOhrTYoaOerC3R+j46D3MuiwSFg4ZwlTHifw9g8SEoMEmElOxlK2GhcTWlqKxoX0ykkKAzLCkqhSbiPEDUIKqiVPBCuKxRwRW2A4XmIrtIk10ZNAEb5kGoIGSIkC9goR7RCPmZ2R0v46HgiEPaW8K7FmhI1TClLHqt2eXSvuBjuFQ0tbYpU+DDR8xEuYEpmxeXEoXo0yRu8m5tIYZosOzDYFkxvLK6GGF5y+R2O7Q0h03btTRNJE5ztpJC1TZufe7TGFaOzafXNCL9bIrfGw-NIJsR2xLXM8tK8JiewsDXGSsw9goihb6sJFImEwPba8mOHCB70T7YgfwOpRxDO2LMMC5zR0nTqaqIswRRyplmPqturbl1R3FfQSVWUt1CSOrKKRElxjBEIRqUd5CZg10NDmOEOw51pqpSHe9J9H0doQSamac1DE002mGiqBoJhohmPtaSxCOXlzxFXYDEF5WeFvUu2DrCn16KDZwkNb7iw1xWN+j9DgliQnLvDPauwDRgUatJGut7ODUAgAAeWyPkfkJBYAsLffoHUEFfl4ZrhJHYbsiy7qVSiGuEF8z+LCEAA */
        id: 'ChatPackerMachine',
        initial: 'Idle',
        context: {
          tripInfo: null,
          conversation: null,
          response: null,
          errorMessage: null,
          flightIds: null,
          accommodationIds: null,
        },
        states: {
          Idle: {
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
              onError: [
                {
                  target: 'Idle',
                },
              ],
            },
          },
          NeedMoreDetails: {
            invoke: {
              src: 'sendConversation',
              id: 'invoke-8xcu0',
              onDone: [
                {
                  target: 'Idle',
                  actions: 'collectResponse',
                },
              ],
              onError: [
                {
                  target: 'Idle',
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
                      target: '#ChatPackerMachine.EndOfConversation',
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
                      target: '#ChatPackerMachine.EndOfConversation',
                      cond: 'isSelectionAccommodationOK',
                      actions: 'saveAccommodationSelection',
                    },
                    { target: '#ChatPackerMachine.AccommodationAssistance.Searching' },
                  ],
                },
              },
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
