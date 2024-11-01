// promises.ts
import { screen, titleBox, infoBox, createGrid } from './ui';
import ItemGenerator from './ItemGenerator';
import Animal from './Animal';

type Mode = 'Parallel' | 'Linear' | 'First Found';
let currentMode: Mode = 'Parallel';

let secondsElapsed = 0;
let timerInterval: NodeJS.Timeout | null = null;

const getMode = () => currentMode;

// Function to start the timer and update the title every second
const startTimer = () => {
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        secondsElapsed += 1;
        titleBox.setContent(`{center}Time Elapsed: ${secondsElapsed} - Animals of the World - Mode: ${currentMode}{/center}`);
        screen.render();
    }, 1000);
    // Initial title update
    titleBox.setContent(`{center}Time Elapsed: ${secondsElapsed} - Animals of the World - Mode: ${currentMode}{/center}`);
    screen.render();
};

// Function to stop the timer
const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
};

// Function to update the title when done
const updateTitle = () => {
    titleBox.setContent(`{center}Total Time for Fetch: ${secondsElapsed} - Animals of the World - Mode: ${currentMode}{/center}`);
    screen.render();
};

// Create an instance of ItemGenerator
const itemGenerator = new ItemGenerator();

// Create the grid
const grid = createGrid();

// Function to refresh the grid with new items in parallel
const refreshGrid = async () => {
    startTimer();

    // Set initial content
    for (let row of grid) {
        for (let box of row) {
            box.setContent('searching\nplease wait');
        }
    }
    screen.render();

    // Fetch items in parallel
    const promises: Promise<void>[] = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const itemIndex = Math.floor(Math.random() * 100);
            const promise = itemGenerator.getItem(itemIndex).then((item: Animal) => {
                const message = ` ${item.name}\n Happy ${item.location === 'land' ? 'on' : 'in'} ${item.location}`;
                grid[row][col].setContent(message);
                screen.render();
            });
            promises.push(promise);
        }
    }
    await Promise.all(promises);

    stopTimer();
    updateTitle();
};

// Function to refresh the grid with new items linearly
const refreshGridLinear = async () => {
    startTimer();

    // Set initial content
    for (let row of grid) {
        for (let box of row) {
            box.setContent('searching\nplease wait');
        }
    }
    screen.render();

    // Fetch items one by one
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const itemIndex = Math.floor(Math.random() * 100);
            const item = await itemGenerator.getItem(itemIndex);
            const message = ` ${item.name}\n Happy ${item.location === 'land' ? 'on' : 'in'} ${item.location}`;
            grid[row][col].setContent(message);
            screen.render();
        }
    }

    stopTimer();
    updateTitle();
};

// Function to refresh the grid with new items using Promise.any
const refreshGridFirstFound = async () => {
    startTimer();

    // Set initial content
    for (let row of grid) {
        for (let box of row) {
            box.setContent('searching\nplease wait');
        }
    }
    screen.render();

    // Fetch items
    const promises: Promise<void>[] = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const itemIndex = Math.floor(Math.random() * 100);
            const promise = itemGenerator.getItem(itemIndex).then((item: Animal) => {
                const message = ` ${item.name}\n Happy ${item.location === 'land' ? 'on' : 'in'} ${item.location}`;
                grid[row][col].setContent(message);
                screen.render();
            });
            promises.push(promise);
        }
    }

    // Wait for the first promise to resolve
    await Promise.race(promises);

    // Stop timer and update title
    stopTimer();
    updateTitle();
};

const refreshFunctions: { [key in Mode]: () => Promise<void> } = {
    'Parallel': refreshGrid,
    'Linear': refreshGridLinear,
    'First Found': refreshGridFirstFound,
};

// Initial population of the grid
refreshFunctions[currentMode]();

// Listen for key presses
screen.key(['q', 'C-c'], () => process.exit(0));

screen.key(['r'], () => {
    infoBox.setContent('Refreshing items...');
    screen.render();
    const refreshFunction = refreshFunctions[currentMode];
    refreshFunction().then(() => {
        infoBox.setContent(
            'Hello! Press {bold}q{/bold} to quit, {bold}r{/bold} to refresh, {bold}t{/bold} to toggle mode.'
        );
        screen.render();
    });
});

// Cycle through modes with 't' key
const modes: Mode[] = ['Parallel', 'Linear', 'First Found'];
screen.key(['t'], () => {
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    currentMode = modes[nextIndex];
    infoBox.setContent(`Switched to ${currentMode} mode. Press {bold}r{/bold} to refresh.`);
    screen.render();
});

// Render the initial screen
screen.render();