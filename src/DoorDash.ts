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
        await Promise.all(promises);

        // Update status box title to "Status: Complete"
        statusBox.setLabel('Status: Complete');
        screen.render();

        // Allow new orders to be taken
        setProcessingOrder(false);
        orderBox.setLabel('Order Open');
        screen.render();
    }
});

// Exit the program.
screen.key(['q', 'C-c'], () => process.exit(0));