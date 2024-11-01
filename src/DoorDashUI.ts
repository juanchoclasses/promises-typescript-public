// DoorDashUI.ts
import blessed from 'blessed';

export const screen = blessed.screen({
    smartCSR: true,
    title: 'DoorDash Console App',
});

export const menuItems = [
    'Pizza',
    'Burger',
    'Sushi',
    'Ginger Beef',
    'Pasta',
    'Salad',
    'Tacos',
    'Fried Rice',
    'Steak',
];

export let orderItems: string[] = [];
let isProcessingOrder = false;
let statusMap: { [item: string]: string } = {};

// Title box at the top.
export const titleBox = blessed.box({
    top: 0,
    left: 'center',
    width: '100%',
    height: 3,
    content: '{center}The Zippiest Food Delivery App{/center}',
    tags: true,
    style: {
        fg: 'white',
        bg: 'blue',
    },
});
screen.append(titleBox);

// Menu box on the left (30% width).
export const menuBox = blessed.box({
    top: 3,
    left: 0,
    width: '30%',
    height: '80%-3',
    label: 'Menu (No duplicates)',
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'yellow',
        },
    },
    content: menuItems.map((item, index) => `${index + 1}. ${item}`).join('\n'),
});
screen.append(menuBox);

// Order box in the middle (30% width).
export const orderBox = blessed.box({
    top: 3,
    left: '30%',
    width: '30%',
    height: '80%-3',
    label: 'Order Open',
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
screen.append(orderBox);

// Status box on the right (40% width).
export const statusBox = blessed.box({
    top: 3,
    left: '60%',
    width: '40%',
    height: '80%-3',
    label: 'Status: Waiting for order',
    border: {
        type: 'line',
    },
    style: {
        border: {
            fg: 'magenta',
        },
    },
    content: '',
});
screen.append(statusBox);

// Instructions box at the bottom.
export const instructions = blessed.box({
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 3,
    content: 'Select dishes by pressing 1-9. Press "o" to order. Press "q" to quit.',
    tags: true,
});
screen.append(instructions);

// Update order display.
export const updateOrder = () => {
    orderBox.setContent(orderItems.join('\n'));
    screen.render();
};

// Function to pad item names to 12 characters, right-justified.
export const padItemName = (item: string) => {
    return item.padStart(12, ' ');
};

// Update status display.
export const updateStatus = (item: string, status: string) => {
    const paddedItem = padItemName(item);
    statusMap[item] = `${paddedItem}: ${status}`;
    const statusContent = Object.values(statusMap).join('\n');
    statusBox.setContent(statusContent);
    screen.render();
};

// Functions to manage state
export const setProcessingOrder = (value: boolean) => {
    isProcessingOrder = value;
};

export const resetStatusMap = () => {
    statusMap = {};
};

// Functions to get state
export const getProcessingOrder = () => isProcessingOrder;

// Render the screen.
screen.render();