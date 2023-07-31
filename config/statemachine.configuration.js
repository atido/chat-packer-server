const stateMachineStatesConfig = {
  id: "ChatPackerMachine",
  initial: "Idle",
  states: {
    Idle: {
      on: {
        MESSAGE: {
          target: "TripInfoCollected",
        },
      },
    },
    TripInfoCollected: {
      invoke: {
        src: "extractTripInfo",
        id: "invoke-mgdk0",
        onDone: [
          {
            target: "#ChatPackerMachine.FlightAssistance.RequestingAssistance",
            cond: "isComplete",
          },
          {
            target: "NeedMoreDetails",
          },
        ],
        onError: [
          {
            target: "Idle",
          },
        ],
      },
    },
    NeedMoreDetails: {
      invoke: {
        src: "sendConversation",
        id: "invoke-8xcu0",
        onDone: [
          {
            target: "Idle",
          },
        ],
        onError: [
          {
            target: "Idle",
          },
        ],
      },
    },
    FlightAssistance: {
      initial: "RequestingAssistance",
      states: {
        RequestingAssistance: {
          invoke: {
            src: "askToChatGPT",
            id: "invoke-rzwf7",
            onDone: [
              {
                target: "WaitingForResponse",
              },
            ],
          },
        },
        WaitingForResponse: {
          on: {
            MESSAGE: {
              target: "CheckingResponse",
            },
          },
        },
        CheckingResponse: {
          invoke: {
            src: "checkResposne",
            id: "invoke-x0jxg",
            onDone: [
              {
                target: "Searching",
                cond: "isOK",
              },
              {
                target: "#ChatPackerMachine.AccomodationAssistance.RequestingAssistance",
              },
            ],
          },
        },
        Searching: {
          invoke: {
            src: "searchFlights",
            id: "invoke-ax0ty",
            onDone: [
              {
                target: "WaitingForSelection",
              },
            ],
          },
        },
        WaitingForSelection: {
          on: {
            SELECT: {
              target: "#ChatPackerMachine.AccomodationAssistance.RequestingAssistance",
            },
          },
        },
      },
    },
    AccomodationAssistance: {
      initial: "RequestingAssistance",
      states: {
        RequestingAssistance: {
          invoke: {
            src: "askToChatGPT",
            id: "invoke-0d6rp",
            onDone: [
              {
                target: "WaitingForResponse",
              },
            ],
          },
        },
        WaitingForResponse: {
          on: {
            MESSAGE: {
              target: "CheckingResponse",
            },
          },
        },
        CheckingResponse: {
          invoke: {
            src: "checkResponse",
            id: "invoke-f3p7g",
            onDone: [
              {
                target: "Searching",
                cond: "isOK",
              },
              {
                target: "#ChatPackerMachine.EndOfConversation",
              },
            ],
          },
        },
        Searching: {
          invoke: {
            src: "searchAccommodations",
            id: "invoke-8qm4i",
            onDone: [
              {
                target: "WaitingForSelection",
              },
            ],
          },
        },
        WaitingForSelection: {
          on: {
            SELECT: {
              target: "#ChatPackerMachine.EndOfConversation",
            },
          },
        },
      },
    },
    EndOfConversation: {
      type: "final",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
};

module.exports = { stateMachineStatesConfig };
