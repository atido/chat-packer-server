const { createMachine } = require('xstate');

const chatMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGEAWBDALgBXQYwGswAnAWX1QEsA7MAOgHV1LMaoAxAe2IBVjKADgElqAM04BiUgFEAyrICCAcWkBtAAwBdRKAGdYLSp2o6QAD0QB2AGwBOOtYCMAZnXPLj9bfcBWADQgAJ6IALT2ABwALOExturWluoATEk+4c4AvhkBaFi4hCTkeFS0dHyCIuLInAA2NWB4mJASEMb0NABunER0nd1gIQC2UBAE6hraSCB6BqzGphYI9m7OSW6OqQHBCD7JdIk+SZ7Okc5OlpnZILk4+ERkFDT05cJinNV1DU0QLW291F0en0iEMRmNVI5Jrp9IZ5lNFo4onQfJFPJEkrZIj5rEc3FtEM5wkk6ISEo5bNZ3I4fNisjkMLcCg9ik8yvxXlVavVGs0SMRuHQBDUsOJiIN-oCBsNRuMtKYZrCTPDEI5qY46Op1D5bNijuEbHigqFrOo6ElIjr0bYklFjs4fHTrgz8vciiV6AA5MCQUjcMAAETAmGYNVgv1KwPaAP6IXCZjwAFdZVDpjC5krQIsbfZbC57RdbPrIibnPiEKliY5LDS1jFybZLBdHTcXYVHqUvT6-YHg5RQxI+QKhSLuOLI7H40mJvK00YM+ZEMXwsi3NZwpiMbYKYbtlWfHQq+pPEecZZwpqHVcW3c2yzSuwapQoKhMApYAZYMHqHh6AAlMAAI4JnArDUFAb4fl+P5SHIigqNOUwKumCyIHYzj7OEGyRB42rnLYZbWLsZoXkcljROiJzNs6N7Mu6dAPk+L4QZQn7oN+9BoA0BBsP+QqBOGUaShKMZmOoABWZhQAh0KzHOKEIBs6iWHQFpbjWx6ONEBEmmazg6vqURKdWVF5DRbqsgxz6vu+LFQRxqBcTxYB8QJwlAtGIKiRJUmQjOslwpmKrqNhZrrta4RpAapZGgg66RA4+o+NSUSYcWl70qZTLmfej5WcxrHsXQshgOgxB3lArmRm5AzoKJmCBNJqb+fOCKWDqdARWkhFbuaeYEYSGouMkiImqR1gmYyrrtvQllMTZBU-owzCgRw3DFdy6YwfIyhqHKiGzgFC7ls4J37EkemYeSJ1btYBHonQ3jVph1iES9ZwTa2tEWblc2QWxi2cYQbDrV8c6VR5gkxj4BCBNYNSNUhcnKsdVYqT4NjOMe9obEkZaFuqh7asFmrrlqH1mdN9E-dZf2FYD3FgSDjRg60EYQ9VITQ7D8O+ftzXyea7hmlWCReJqmPYWW2KmkZCQWskGLpU6mVTXe9AKHgeCcIMgycBAWBzvldl0P+QEgWwRv-WAW1wbtKaI4dizhJSGonI4Tjaj49qRJEZYuDS+zqOuhyau7bXhOTWWUxrWs63rBvGJbdMOUDYG8TU-Gs5D7mSiEojOAIlhSXtMmKvJLhtSSxbWD7hbBWu-gxS4hH7NER7npi6yXBlk23nRMfa7r+vpknAMpwzUDp5nfxVeO+eFz59sHS1KoYqaOrozXXuJDqftpPF7vYZSuYveSkSR6r-ea4P8cj-NxvFaV5Xg0J47hABgyRJQCPLwLWrWK3c01ZvAmiUr7JuJ11SY3SJ4NcuZg4Xz7qyAecdh6G3vlbJahgwJcGIEzTaMhtrwRLk1MuyNUirBUnpMiHhsJez9icYkw0sRKROvERwiCvqlBQUPBO1BR72UcozMAG0WYz3ZuOLmlh4YkIdivcscQD7nWSFEc0ThcZNxwiSQkxwop2HPleaiUc1Z0B4bfdBtMx5CKgPgsRbNX4Q05jDaREIl783IZhYkCRtRJEItha0lg-a9QPOSXCXsMQYgjoYlWSDSiyHQB0NgLwX79A5lzcIMi3FkMCgpdE6pzS7CJG3JcjddxRHQoWQsa5D7xFSFkK41A9ZwFMNeYx7o-LZKOiEAaFIEgUkSmWEImllJkUtBE20bgDE90+tlegTBsGrV4OySonAOnIWRuSGWKQjh9LXNWIJHVGwJBOKsBsZEqycNmWyCobwPgbUgGspGOTPARWRBiPSVJ9QljLGsHM3gXA2kOOkXplzKadggL6YgAYgwhngHzTpixN77ESCcrwLzyRlkxgA9E3VMaEg8GRUFJjZo01slbR5jsCTYgcGec5PjqwjTLNhYk6MbCjIVjqNwRK6IkoESbQCwFPwWwwexCl8jIjBRpUWakASkrOwItqXS+lTijRFty76jFSULUEanSezkM5ivkvqZSEqcT2lwmsGkd0czB3SE4Ayzt1U5U1Xyx+ZUShQENRso+g0aRJQSPqHU+EYqUn3AWfeZxho2CdTNamfL5krVwbYw6ci-5JQ1IkUBIDNRkQVfYc6yrI1jRjVTF1IqrG6uTfOVN5DtTxRtKLDwEVXAnGtQ9W1KQNiYg2CWsxaDE7lrAF6nJqJlhuzans0pKpqToScEGwipzIm9uvqgvhfLTaCpWgI4dR1izKUmVWfp+yIFYgenXcWcQz7Ltjrwu+lidUTynjuhE9cHDampOLM+GKIEBwtOeFw+o1hYmvTfft-DB1FRKu6tgz6VSEVNFiE0YdgUvXCAw1EZo26aScCcQl0Te5cPViu29FiyWFQTWwJNIjQYpt-uQzG6ozxB2dklM4Fwp0KTOPFMi-6LrBSxSB1dd6yMVonlW2D5YjkakpBsSNiUogMJRA9c1Q19KrCSCW+JiSwIvAk83eKbgkq6g41WShZxnqmrqfhmZlNpDUAgAAeVENUAEJBYB8L03pU03izwbBM5yjUmFCzO0RIcYD9SgA */
  id: 'ChatPackerMachine',
  initial: 'Idle',
  context: {
    tripInfo: null,
    conversation: [],
    flightIds: [],
    accommodationIds: [],
    userId: null,
    tripCreatedId: null,
  },
  states: {
    Idle: {
      on: {
        INIT: {
          target: 'WaitingForTripInfo',
          actions: 'initConversation',
        },
      },
    },
    WaitingForTripInfo: {
      tags: 'pause',
      on: {
        MESSAGE: {
          target: 'TripInfoCollected',
          actions: 'saveMessage',
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
          actions: ['tellErrorMessage', 'logError'],
        },
      },
    },

    NeedMoreDetails: {
      invoke: {
        src: 'sendConversationToChatGPT',
        id: 'invoke-8xcu0',
        onDone: [
          {
            target: 'WaitingForTripInfo',
          },
        ],
        onError: [
          {
            target: 'WaitingForTripInfo',
            actions: ['tellErrorMessage', 'logError'],
          },
        ],
      },
    },

    FlightAssistance: {
      initial: 'RequestingAssistance',
      states: {
        RequestingAssistance: {
          entry: 'askToUserFlightAssistance',
          tags: 'pause',
          on: {
            MESSAGE: {
              target: 'CheckingReply',
              actions: 'saveMessage',
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
            onError: { target: 'RequestingAssistance', actions: ['tellErrorMessage', 'logError'] },
          },
        },

        Searching: {
          invoke: {
            src: 'searchFlights',
            id: 'invoke-ax0ty',
            onDone: {
              target: 'WaitingForSelection',
            },
            onError: {
              target: 'RequestingAssistance',
              actions: ['tellErrorMessage', 'logError'],
            },
          },
        },

        WaitingForSelection: {
          tags: 'pause',
          on: {
            MESSAGE: {
              target: 'CheckingSelection',
              actions: 'saveMessage',
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
            onError: { target: 'WaitingForSelection', actions: ['tellErrorMessage', 'logError'] },
          },
        },
      },
    },

    AccommodationAssistance: {
      initial: 'RequestingAssistance',
      states: {
        RequestingAssistance: {
          entry: 'askToUserAccommodationAssistance',
          tags: 'pause',
          on: {
            MESSAGE: {
              target: 'CheckingReply',
              actions: 'saveMessage',
            },
          },
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
            onError: { target: 'RequestingAssistance', actions: ['tellErrorMessage', 'logError'] },
          },
        },

        Searching: {
          invoke: {
            src: 'searchAccommodations',
            id: 'invoke-8qm4i',
            onDone: {
              target: 'WaitingForSelection',
            },
            onError: { target: 'RequestingAssistance', actions: ['tellErrorMessage', 'logError'] },
          },
        },

        WaitingForSelection: {
          tags: 'pause',
          on: {
            MESSAGE: {
              target: 'CheckingSelection',
              actions: 'saveMessage',
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
            onError: { target: 'WaitingForSelection', actions: ['tellErrorMessage', 'logError'] },
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
          },
        ],
        onError: { target: 'EndOfConversation', actions: ['tellErrorService', 'logError'] },
      },
    },

    EndOfConversation: {
      type: 'final',
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
});

module.exports = { chatMachine };
