// ui.ts
import blessed from 'blessed';

// Create a screen object.
export const screen = blessed.screen({
    smartCSR: true,
    title: 'TypeScript Curses-like App',
});

// Create a title box.
export const titleBox = blessed.box({
    top: 0,
    left: 'center',
    width: '70%',
    height: 3,
    content: '',
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'cyan',
        },
    },
});
screen.append(titleBox);

// Create an info box.
export const infoBox = blessed.box({
    top: 18,
    left: 'center',
    width: '70%',
    height: '10%',
    content: 'Hello! Press {bold}q{/bold} to quit, {bold}r{/bold} to refresh, or {bold}t{/bold} to toggle mode.',
    tags: true,
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'cyan',
        },
    },
});
screen.append(infoBox);

// Function to update the timer every second.
export const updateTimer = (getSecondsElapsed: () => number, getMode: () => string) => {
    setInterval(() => {
        const secondsElapsed = getSecondsElapsed();
        const mode = getMode();
        titleBox.setContent(`{center}Time Elapsed: ${secondsElapsed} - Animals of the World - Mode: ${mode}{/center}`);
        screen.render();
    }, 1000);
};

// Create a grid to display items.
export const createGrid = () => {
    const grid: blessed.Widgets.BoxElement[][] = [];
    for (let row = 0; row < 2; row++) {
        grid[row] = [];
        for (let col = 0; col < 3; col++) {
            const itemBox = blessed.box({
                top: row * 7 + 3,
                left: col * 30,
                width: 20,
                height: 4,
                content: '',
                tags: true,
                border: {
                    type: 'line',
                },
                style: {
                    border: {
                        fg: 'magenta',
                    },
                },
            });
            grid[row][col] = itemBox;
            screen.append(itemBox);
        }
    }
    return grid;
};