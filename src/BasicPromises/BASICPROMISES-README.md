# Basic Promises Console App

## Overview

This project is a demonstration of how promises work in TypeScript using a console-based visualization. It leverages the `blessed` library to create a console interface that visually tracks the status of multiple promises over time. The application simulates the asynchronous nature of promises, helping users understand how promises are resolved or rejected in a timed sequence.

## Features

- **Visual Console UI**: Uses `blessed` to create a user-friendly console interface to display the status of promises.
- **Promise Lifecycle Tracking**: Displays the lifecycle of 10 promises, each with an increasing delay to illustrate how promises are fulfilled over time.
- **Interactive Controls**: Allows users to restart the simulation (`r`) or quit the application (`q`).

## How It Works

- The app creates 10 promises, each with a delay incrementing by 1 second (1s, 2s, 3s, etc.).
- The promise statuses are displayed in the console as either `Pending`, `Fulfilled`, or `Rejected`.
- The application uses a status box to visually track the progress of each promise and updates the display every 0.1 seconds.
- The promises are all resolved in sequence, and their status is updated in real-time until all promises are either fulfilled or rejected.

## Running the Application

### Prerequisites



### Running the Demo

1. Run the application:
   ```sh
   ts-node src/BasicPromises/basicPromises.ts
   ```
   

2. The console interface will display the title, instructions, and the status of the promises.

3. **Controls**:
   - Press **`r`** to restart the simulation.
   - Press **`q`** to quit the application.

## Code Structure

- **basicPromises.ts**: The main script file containing the logic for creating promises and updating the UI.
  - **`createPromise(label, duration)`**: Function to create a promise that resolves after a given time.
  - **`startSimulation()`**: Initializes the promises and begins the status update loop.
  - **`updateStatusDisplay()`**: Updates the status of each promise in the console.
  - **`checkPromises()`**: Monitors and updates the fulfillment status of each promise.

## Learning Objectives

This demo is designed to help users understand the following concepts:

1. **Promises**: Understand the asynchronous nature of JavaScript promises and how they move through different states (Pending, Fulfilled, Rejected).
2. **UI Feedback Loop**: See how real-time updates work in a console UI by simulating time-based resolution of promises.


## Customization

- **Number of Promises**: You can adjust the number of promises created by modifying the loop inside `startSimulation()`.
- **Failure Probability**: You could add rejection paths by adding random failures within the promise function to demonstrate error handling.

## Class exercise

Modify the createPromise function to implement a random failure probability. This will allow you to demonstrate how promises handle rejections and error states.

Find this function in the BasicPromises.ts file:
```typescript

// Function to create a promise that resolves after a given time.
const createPromise = (label: string, duration: number) => {
    return new Promise<string>((resolve) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= duration) {
                clearInterval(interval);
                resolve(`${label} fulfilled`);
            }
        }, 100); // Check every 0.1 second
    });
};

```

Change it so that it has a third parameter (probability of failure) then when you are checking if the thing is done you can generate a random number and if it is less than the probability of failure then you reject the promise.

You will also have to change the way you are calling the function to pass in the probability of failure.  (you want really really small probabilities.  Like 0.01 or 0.001)