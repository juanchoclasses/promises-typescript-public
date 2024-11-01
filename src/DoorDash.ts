// DoorDash.ts
import blessed from 'blessed';
import OrderProcessor from './OrderProcessor';

// Create a screen object.
const screen = blessed.screen({
    smartCSR: true,
    title: 'DoorDash Console App',
});

// Menu items.
const menuItems = [
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
let orderItems: string[] = [];
let isProcessingOrder = false;

// Title box at the top.
const titleBox = blessed.box({
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
const menuBox = blessed.box({
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
const orderBox = blessed.box({
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
const statusBox = blessed.box({
    top: 3,
    left: '60%',
    width: '40%',
    height: '80%-3',
    label: 'Status: Waiting for order selection',
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
const instructions = blessed.box({
    bottom: 0,
    left: 'center',
    width: '100%',
    height: 3,
    content: 'Select dishes by pressing 1-9. Press "o" to order. Press "q" to quit.',
    tags: true,
});
screen.append(instructions);

// Status map to track each item's status.
let statusMap: { [item: string]: string } = {};

// Update order display.
const updateOrder = () => {
    orderBox.setContent(orderItems.join('\n'));
    screen.render();
};

// Function to pad item names to 12 characters, right-justified.
const padItemName = (item: string) => {
    return item.padStart(12, ' ');
};

// Update status display.
const updateStatus = (item: string, status: string) => {
    const paddedItem = padItemName(item);
    statusMap[item] = `${paddedItem}: ${status}`;
    const statusContent = Object.values(statusMap).join('\n');
    statusBox.setContent(statusContent);
    screen.render();
};

// Key bindings for menu selection.
screen.key(['1', '2', '3', '4', '5', '6', '7', '8', '9'], (ch) => {
    if (isProcessingOrder) {
        orderBox.setLabel('Order Selection not allowed');
        screen.render();
        return;
    }

    const index = parseInt(ch) - 1;
    const item = menuItems[index];

    if (orderItems.includes(item)) {
        // Prevent duplicate selections.
        statusBox.setContent(`You have already selected ${item}.`);
        screen.render();
    } else if (orderItems.length < 9) {
        orderItems.push(item);
        updateOrder();
        statusBox.setLabel('Status: Waiting for order selection');
        screen.render();
    }
});

// Key binding for placing the order.
screen.key(['o'], async () => {
    if (isProcessingOrder) {
        orderBox.setLabel('Order Selection not allowed');

        screen.render();
        return;
    }

    if (orderItems.length === 0) {
        statusBox.setContent('No items selected.');
        screen.render();
    } else {
        isProcessingOrder = true;
        statusMap = {}; // Reset status map.
        const itemsToProcess = [...orderItems];
        orderItems = [];
        updateOrder();

        // Update status to InProgress
        statusBox.setLabel('Status: InProgress');
        orderBox.setLabel('Order Selection not allowed');
        orderBox.setContent('We can only make one customer happy at a time. ');
        screen.render();

        // Create an array of promises for processing each item
        const promises = itemsToProcess.map(item => {
            const processor = new OrderProcessor(item, updateStatus);
            return processor.processOrder();
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        // Update status box title to "Status: Complete"
        statusBox.setLabel('Status: Complete');
        screen.render();

        // Allow new orders to be taken
        isProcessingOrder = false;
        orderBox.setLabel('Order Open');
        orderBox.setContent('');

        statusBox.setLabel('Status: Waiting for order selection');
        statusBox.setContent('');
        screen.render();
    }
});

// Exit the program.
screen.key(['q', 'C-c'], () => process.exit(0));

// Render the screen.
screen.render();