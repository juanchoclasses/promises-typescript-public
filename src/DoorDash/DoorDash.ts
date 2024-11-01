import { RestaurantError } from './RestaurantError';

// DoorDash.ts
import {
    screen,
    menuItems,
    orderItems,
    titleBox,
    menuBox,
    orderBox,
    statusBox,
    instructions,
    updateOrder,
    padItemName,
    updateStatus,
    setProcessingOrder,
    resetStatusMap,
    getProcessingOrder,
} from './DoorDashUI';
import OrderProcessor from './OrderProcessor';

// Key bindings for menu selection.
screen.key(['1', '2', '3', '4', '5', '6', '7', '8', '9'], (ch) => {
    if (getProcessingOrder()) {
        orderBox.setLabel('Not allowed');
        return;
    }

    const index = parseInt(ch) - 1;
    const item = menuItems[index];

    if (orderItems.includes(item)) {
        // Prevent duplicate selections.
        statusBox.setContent(`Already selected ${item}.`);
        screen.render();
    } else if (orderItems.length < 9) {
        orderItems.push(item);
        updateOrder();
        statusBox.setLabel('Status: Waiting for order');
        statusBox.setContent('');
        screen.render();
    }
});

// Key binding for placing the order.
screen.key(['o'], async () => {
    if (getProcessingOrder()) {
        orderBox.setLabel('Not allowed');
        screen.render();
        return;
    }

    if (orderItems.length === 0) {
        statusBox.setContent('No items selected.');
        screen.render();
    } else {
        setProcessingOrder(true);
        resetStatusMap(); // Reset status map.
        const itemsToProcess = [...orderItems];
        orderItems.length = 0; // Clear orderItems array
        updateOrder();

        // Update status to InProgress
        statusBox.setLabel('Status: InProgress');
        orderBox.setLabel('Not allowed');
        screen.render();

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
        // Update status box with summary message
        statusBox.setLabel(summaryTitle);
        statusBox.setContent(summaryMessage);

        // Allow new orders to be taken
        setProcessingOrder(false);
        orderBox.setLabel('Order Open');
        screen.render();
    }
});

// Exit the program.
screen.key(['q', 'C-c'], () => process.exit(0));