// basicPromises.ts
import blessed from 'blessed';

// Create a screen object.
const screen = blessed.screen({
    smartCSR: true,
    title: 'Basic Promises Console App',
});

// Title box at the top.
const titleBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: 3,
    content: '{center}Promise Status Display{/center}',
    tags: true,
    style: {
        fg: 'white',
        bg: 'blue',
    },
});
screen.append(titleBox);

// Status box to display the status of the promises.
const statusBox = blessed.box({
    top: 3,
    left: 'center',
    width: '80%',
    height: '80%',
    label: 'Status',
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'green',
        },
    },
    content: '',
});
screen.append(statusBox);

// Instructions box at the bottom.
const instructions = blessed.box({
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 3,
    content: 'Press "r" to restart, "q" to quit.',
    tags: true,
});
screen.append(instructions);

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

// Variable to track if the simulation is running.
let isRunning = false;

// Function to initialize and start the simulation.
const startSimulation = () => {
    if (isRunning) return;

    isRunning = true;

    // Create ten promises with durations incrementing by 1 second.
    const promises = [];
    for (let i = 0; i < 10; i++) {
        const duration = (i + 1) * 1000; // Increment by 1 second
        const label = `Promise ${(i + 1).toString().padStart(2, '0')}`;
        promises.push(createPromise(label, duration));
    }

    // Array to store the status of the promises.
    const promiseStatuses = promises.map((promise, index) => ({
        label: `Promise ${(index + 1).toString().padStart(2, '0')}`,
        status: 'Pending',
        expected: `${(index + 1).toString().padStart(2, ' ')}s`,
        promise,
    }));

    // Variable to track the elapsed time.
    let elapsedTime = 0;

    // Function to update the status display.
    const updateStatusDisplay = () => {
        elapsedTime += 0.1;
        const statusContent = promiseStatuses.map(p => `${p.label} (expected ${p.expected}): ${p.status}`).join('\n');
        statusBox.setLabel(`Status - Time Elapsed: ${elapsedTime.toFixed(1)}s`);
        statusBox.setContent(statusContent);
        screen.render();
    };

    // Function to check the status of each promise.
    const checkPromises = () => {
        promiseStatuses.forEach((p, index) => {
            p.promise.then((message) => {
                promiseStatuses[index].status = 'Fulfilled';
            }).catch(() => {
                promiseStatuses[index].status = 'Rejected';
            });
        });
    };

    // Update the display 10 times a second.
    const interval = setInterval(() => {
        checkPromises();
        updateStatusDisplay();

        // Check if all promises are fulfilled.
        const allFulfilled = promiseStatuses.every(p => p.status === 'Fulfilled' || p.status === 'Rejected');
        if (allFulfilled) {
            clearInterval(interval); // Stop updating the display after all promises are settled.
            updateStatusDisplay(); // Final update to show all statuses.
            isRunning = false; // Mark the simulation as not running.
            statusBox.setLabel('Press r to restart, q to quit');
            screen.render();
        }
    }, 100);
};

// Key binding for restarting the simulation.
screen.key(['r'], () => {
    if (!isRunning) {
        startSimulation();
    }
});

// Exit the program.
screen.key(['q', 'C-c'], () => process.exit(0));

// Initial render.
screen.render();

// Start the initial simulation.
startSimulation();