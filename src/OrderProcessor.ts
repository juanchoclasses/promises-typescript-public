// OrderProcessor.ts
export default class OrderProcessor {
    private item: string;
    private statusCallback: (item: string, status: string) => void;

    constructor(item: string, statusCallback: (item: string, status: string) => void) {
        this.item = item;
        this.statusCallback = statusCallback;
    }

    async processOrder() {
        await this.restaurantConfirmed();
        await this.restaurantWorking();
        await this.deliveryPersonPickedUp();
        await this.deliveryComplete();
    }

    private async restaurantConfirmed() {
        this.statusCallback(this.item, 'Restaurant confirmed your order.');
        await this.delay(this.getRandomDelay());
    }

    private async restaurantWorking() {
        this.statusCallback(this.item, 'Restaurant is preparing your item.');
        await this.delay(this.getRandomDelay());
    }

    private async deliveryPersonPickedUp() {
        this.statusCallback(this.item, 'Delivery person has picked up your order.');
        await this.delay(this.getRandomDelay());
    }

    private async deliveryComplete() {
        this.statusCallback(this.item, 'Your order has been delivered. Enjoy your meal!');
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private getRandomDelay() {
        const min = 2000; // 2 seconds
        const max = 6000; // 6 seconds
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}