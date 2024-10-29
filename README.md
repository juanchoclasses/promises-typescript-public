# README

## Overview

This project is a terminal-based application that simulates the behavior of asynchronously fetching data from a backend, built using TypeScript and the `blessed` library for terminal UI. The focus is on showcasing both parallel and linear asynchronous operations using Promises and `async/await` mechanisms in TypeScript.

### ItemGenerator.ts

The `ItemGenerator.ts` file contains a class called `ItemGenerator`. This class is designed to simulate the behavior of fetching data from a backend API with some randomness in the delay. It includes an array of animal objects, each with a name and a location (e.g., land, water, sky). The `getItem(i: number)` method returns an animal from the array, and it incorporates a random delay between 1 and 4 seconds to mimic a real-world scenario where network latency or backend processing time affects the data retrieval.

The method works by wrapping the data retrieval in a `Promise` that resolves after a `setTimeout`, simulating the variability and unpredictability of backend responses. This provides an environment to better understand how asynchronous programming works, particularly in contexts involving real-time data acquisition.

#### Code Example

```typescript
public async getItem(i: number): Promise<Animal> {
    const delay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1-4 seconds
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(this.items[i % this.items.length]);
        }, delay);
    });
}
```

In this code snippet, the `delay` variable is set to a random value between 1,000 and 4,000 milliseconds. The `Promise` resolves after the specified delay, emulating the kind of unpredictable response time typical in real backend services. This provides an environment to better understand how asynchronous programming works, particularly in contexts involving real-time data acquisition.

### Data Structure

The data stored in `ItemGenerator` consists of an array of animal objects, each represented by the `Animal` interface. The `Animal` interface includes the following properties:

- `name`: A string representing the name of the animal.
- `location`: A string representing where the animal is typically found (`land`, `water`, or `sky`).

Here is an example of the structure:

```typescript
interface Animal {
    name: string;
    location: 'land' | 'water' | 'sky';
}

const exampleAnimals: Animal[] = [
    { name: 'Cat', location: 'land' },
    { name: 'Dolphin', location: 'water' }
];
```

This array contains various animals, each with a name and a location, allowing the program to simulate different environments where the animals can be found.

### Getting Data for the Grid in `promises.ts`

In the `promises.ts` file, the grid is populated with animal data using the `ItemGenerator` class. There are two different methods to refresh the grid, each showcasing a different way to handle asynchronous operations:

1. **Parallel Refresh (`refreshGrid`)**: In this method, data for all the grid elements is fetched concurrently using `Promise.all()`. This is useful to demonstrate how multiple asynchronous requests can be executed in parallel, reducing the overall wait time for data fetching.

2. **Linear Refresh (`refreshGridLinear`)**: In this method, data for each element is fetched sequentially using `await`, meaning each request waits for the previous one to complete before moving on. This linear approach helps in understanding the concept of sequential asynchronous operations, where data is retrieved one at a time.

The `refreshGrid` function uses promises to fetch data in parallel for all cells in the grid:

```typescript
const refreshGrid = async () => {
    const promises: Promise<void>[] = [];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            const itemIndex = Math.floor(Math.random() * 100);
            const promise = itemGenerator.getItem(itemIndex).then((item: Animal) => {
                grid[row][col].setContent(`Item: ${item.name}, Location: ${item.location}`);
                screen.render();
            });
            promises.push(promise);
        }
    }
    await Promise.all(promises);
};
```

In this example, each cell fetches data concurrently, and `Promise.all(promises)` ensures that all promises are resolved before the refresh is considered complete. This makes it more efficient but introduces potential latency variability, as the overall time depends on the slowest response.

The `refreshGridLinear` function, on the other hand, uses a linear approach to update the grid:

```typescript
const refreshGridLinear = async () => {
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            const itemIndex = Math.floor(Math.random() * 100);
            const item = await itemGenerator.getItem(itemIndex);
            grid[row][col].setContent(`Item: ${item.name}, Location: ${item.location}`);
            screen.render();
        }
    }
};
```

In this method, each cell waits for its data to be fetched before moving on to the next, which provides a clearer visual representation of how data flows into the grid, but it may take longer overall compared to the parallel approach.

The ability to toggle between these two refresh modes (`r` key for refresh and `t` key for toggling between parallel and linear modes) provides an interactive way to learn about the differences in asynchronous operations and how they impact the user experience.

### Running the Application

