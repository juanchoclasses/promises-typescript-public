import blessed from 'blessed';
import ItemGenerator from './ItemGenerator';
import Animal from './Animal';

// Create a screen object.
// This is the main screen where all elements will be displayed.
const screen = blessed.screen({
    smartCSR: true, // Enables better rendering by handling overlapping elements.
    title: 'TypeScript Curses-like App', // Title of the terminal window.
});

// Toggle to determine whether to refresh in parallel or linearly.
let refreshInParallel = true;


// Create a title box.
// This box displays the title at the top of the screen.
const titleBox = blessed.box({
    top: 0,
    left: 'center',
    width: '70%',
    height: 3,
    content: `{center}Animals of the World - Mode: ${refreshInParallel ? 'Parallel' : 'Linear'}{/center}`, // Centered title text.
    tags: true, // Enables tag-based formatting for content.
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'cyan', // Border color.
        },
    },
});
screen.append(titleBox); // Append the title box to the screen.

// Create an instance of ItemGenerator.
// This instance is used to fetch animal data asynchronously.
const itemGenerator = new ItemGenerator();

// Create a grid to display items.
// This grid consists of 2 rows and 3 columns to display animal data.
const grid: blessed.Widgets.BoxElement[][] = [];
for (let row = 0; row < 2; row++) {
    grid[row] = [];
    for (let col = 0; col < 3; col++) {
        const itemBox = blessed.box({
            top: row * 7 + 3, // Calculate position based on row index.
            left: col * 30, // Calculate position based on column index.
            width: 20, // Width of each box.
            height: 4, // Height of each box.
            content: '', // Initially empty content.
            tags: true, // Enables tag-based formatting for content.
            border: {
                type: 'line',
            },
            style: {
                border: {
                    fg: 'magenta', // Border color.
                },
            },
        });
        grid[row][col] = itemBox;
        screen.append(itemBox); // Append each item box to the screen.
    }
}

// Function to refresh the grid with new items in parallel.
// This function fetches animal data asynchronously and updates the grid.
const refreshGrid = async () => {
    // Set initial content for all boxes to indicate that data is being fetched.
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            grid[row][col].setContent('searching\nplease wait');
        }
    }
    screen.render(); // Render the updated screen with the "searching" message.

    // Create an array to hold all promises for fetching animal data.
    const promises: Promise<void>[] = [];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            const itemIndex = Math.floor(Math.random() * 100); // Generate a random index for selecting an animal.
            const promise = itemGenerator.getItem(itemIndex).then((item: Animal) => {
                // Update the content of the grid box with the animal's name and location once the promise resolves.
                let message = '';
                if (item.location === 'land') {
                    message = ` ${item.name}\n Happy on ${item.location}`;
                } else {
                    message = ` ${item.name}\n Happy in ${item.location}`;
                }
                grid[row][col].setContent(message);
                screen.render(); // Render the updated screen with the new animal data.
            });
            promises.push(promise); // Add the promise to the list of promises.
        }
    }
    // Wait for all promises to resolve before continuing.
    await Promise.all(promises);
};

// Function to refresh the grid with new items linearly.
// This function waits for each animal data to be fetched in sequence and updates the grid accordingly.
const refreshGridLinear = async () => {
    // Set initial content for all boxes to indicate that data is being fetched.
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            grid[row][col].setContent('searching\nplease wait');
        }
    }
    screen.render(); // Render the updated screen with the "searching" message.

    // Fetch animal data one by one in a linear manner.
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            const itemIndex = Math.floor(Math.random() * 100); // Generate a random index for selecting an animal.
            const item = await itemGenerator.getItem(itemIndex); // Wait for the item to be fetched.
            let message = '';
            if (item.location === 'land') {
                message = ` ${item.name}\n Happy on ${item.location}`;
            } else {
                message = ` ${item.name}\n Happy in ${item.location}`;
            }
            grid[row][col].setContent(message); // Update the grid box with the animal's name and location.
            screen.render(); // Render the updated screen with the new animal data.
        }
    }
};



// Initial population of the grid.
// This call will fill the grid with animal data when the application starts.
refreshGrid();

// Create a box element for displaying output.
// This box displays instructions and status messages at the bottom of the screen.
const infoBox = blessed.box({
    top: 18, // Position below the grid.
    left: 'center',
    width: '70%',
    height: '10%',
    content: 'Hello! Press {bold}q{/bold} to quit, {bold}r{/bold} to refresh, or {bold}t{/bold} to toggle mode.', // Initial instructions.
    tags: true, // Enables tag-based formatting for content.
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'cyan', // Border color.
        },
    },
});

// Append elements to the screen.
screen.append(infoBox);

// Listen for key presses.
// Quit the application when 'q' or 'Ctrl+C' is pressed.
screen.key(['q', 'C-c'], () => {
    return process.exit(0);
});

// Refresh the grid when 'r' is pressed.
screen.key(['r'], () => {
    infoBox.setContent('Refreshing items...'); // Update info box to indicate refresh is in progress.
    screen.render();
    const refreshFunction = refreshInParallel ? refreshGrid : refreshGridLinear;
    refreshFunction().then(() => {
        // Once the refresh is complete, update the info box with the original message.
        infoBox.setContent('Hello! Press {bold}q{/bold} to quit, {bold}r{/bold} to refresh, or {bold}t{/bold} to toggle mode.');
        screen.render();
    });
});

// Toggle between parallel and linear refresh modes when 't' is pressed.
screen.key(['t'], () => {
    refreshInParallel = !refreshInParallel; // Toggle the refresh mode.
    const mode = refreshInParallel ? 'Parallel' : 'Linear';
    titleBox.setContent(`{center}Animals of the World - Mode: ${mode}{/center}`);

    infoBox.setContent(`Switched to ${mode} refresh mode. Press {bold}r{/bold} to refresh.`);
    screen.render();
});

// Render the screen.
screen.render();
