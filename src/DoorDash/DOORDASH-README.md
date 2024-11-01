# DoorDash Console App

This project is a terminal-based application that simulates the behavior of processing food delivery orders asynchronously. It is built using TypeScript and the `blessed` library for terminal UI. The focus is on showcasing the use of Promises and `async/await` mechanisms in TypeScript.

## Installation

To run the program, you need to have Node.js installed on your system. You can download it from the official website: [Node.js](https://nodejs.org/).

After installing Node.js, you can clone this repository and install the necessary dependencies:

```bash
npm install
```

# Running the application

To start the application, run the following command:

```bash
ts-node src/DoorDash/DoorDash.ts
```

The application will start in the terminal, displaying a menu of food items that you can order. You can interact with the application by pressing the following keys:

 - 1-9: Select dishes by pressing the corresponding number.
 - o: Place the order.
 - q: Quit the application.

# Order Processing with Promises

The OrderProcessor class is responsible for simulating the various stages of processing an order. Each stage is represented by an asynchronous method that returns a Promise. The stages include:

1. restaurantConfirmed: Simulates the restaurant confirming the order.
1. restaurantWorking: Simulates the restaurant preparing the order.
1. deliveryPersonPickedUp: Simulates the delivery person picking up the order.
1. deliveryComplete: Simulates the delivery being completed.

Here is an example of the processOrder method in OrderProcessor:

```typescript
export default class OrderProcessor {
    private item: string;
    private statusCallback: (item: string, status: string) => void;
    private probabilityOfFailure = 0.15;

    constructor(item: string, statusCallback: (item: string, status: string) => void) {
        this.item = item;
        this.statusCallback = statusCallback;
    }

    processOrder(): Promise<string> {
        return this.restaurantConfirmed()
            .then((confirmed) => {
                if (!confirmed) {
                    throw new RestaurantError(this.item, 'Restaurant Rejected.');
                }
                return this.restaurantWorking();
            })
            .then((complete) => {
                if (!complete) {
                    throw new RestaurantError(this.item, 'Restaurant Incomplete.');
                }
                return this.deliveryPersonPickedUp();
            })
            .then((pickedUp) => {
                if (!pickedUp) {
                    throw new RestaurantError(this.item, 'Delivery Rejected.');
                }
                return this.deliveryComplete();
            })
            .then((delivered) => {
                if (!delivered) {
                    throw new RestaurantError(this.item, 'Delivery Lost.');
                }
                return this.item;
            })
            .catch((error) => {
                this.statusCallback(this.item, `Order failed: ${error.message}`);
                throw error; // Re-throw the error to reject the promise
            });
    }
}
```

## Using `Promise.all` in `DoorDash.ts`
In `DoorDash.ts`, the `Promise.all` method is used to wait for all the order processing promises to complete before determining which orders succeeded and which failed. This ensures that we get a complete picture of the order processing results.

However, because we use a callback function to update the status of each order, we get early failure messages as soon as an order fails at any stage. This provides real-time feedback on the status of each order.

Here is an example of how Promise.all is used in DoorDash.ts:

```typescript


        // Create an array of promises for processing each item
        const promises = itemsToProcess.map(item => {
            const processor = new OrderProcessor(item, updateStatus);
            return processor.processOrder();
        });

        // Wait for all promises to resolve
        const results = await Promise.allSettled(promises);

        let summaryMessage = 'Successfully delivered:\n*****************\n';
        let summaryTitle = 'Status: Complete';

        // Check for fulfilled promises
        const fulfilledItems = results.filter(result => result.status === 'fulfilled');

        if (fulfilledItems.length === 0) {
            summaryMessage = '';
        }

        fulfilledItems.forEach(result => {
            const { value } = result as any;
            summaryMessage += `${value}\n`;
        });

        // Check for rejected promises
        const rejectedItems = results.filter(result => result.status === 'rejected');

        if (rejectedItems.length > 0) {
            summaryMessage += '*****************\nFailed to deliver:\n*****************\n';
            rejectedItems.forEach(result => {
                const { reason } = result as any;
                const item = reason.item;
                const explanation = reason.explanation;
                summaryMessage += `${item}: ${explanation}\n`;
            });
            summaryTitle = 'Status: Incomplete';
        }

    
```

In this example, Promise.allSettled is used to wait for all the order processing promises to complete. The results are then checked to determine which orders succeeded and which failed. The callback function updateStatus provides real-time feedback on the status of each order as it progresses through the various stages.

# Conclusion
This project demonstrates the use of `Promises` and async/await in TypeScript to handle asynchronous operations in a terminal-based application. By using Promise.allSettled, we can wait for all promises to complete before determining the overall results, while still providing real-time feedback through callback functions. 


# Class exercise #2

Refactor the procedure `processOrder` in `OrderProcessor.ts` so that it uses await instead of chained promises. 


