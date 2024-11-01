// OrderProcessor.ts

import { RestaurantError } from "./RestaurantError";
export default class OrderProcessor {
    private item: string;
    private statusCallback: (item: string, status: string) => void;
    private probabilityOfFailure = 0.15;

    constructor(item: string, statusCallback: (item: string, status: string) => void) {
        this.item = item;
        this.statusCallback = statusCallback;
    }

    async processOrder(): Promise<string> {
        const confirmed = await this.restaurantConfirmed();
        if (!confirmed) {
            throw new RestaurantError(this.item, 'Restaurant Rejected.');
        }
        const complete = await this.restaurantWorking();
        if (!complete) {
            throw new RestaurantError(this.item, 'Restaurant Incomplete.');
        }

        const pickedUp = await this.deliveryPersonPickedUp();
        if (!pickedUp) {
            throw new RestaurantError(this.item, 'Delivery Rejected.');
        }

        const delivered = await this.deliveryComplete();
        if (!delivered) {
            throw new RestaurantError(this.item, 'Delivery Lost.');
        }
        return this.item;
    }

    private async restaurantConfirmed(): Promise<boolean> {
        if (Math.random() < this.probabilityOfFailure) {
            this.statusCallback(this.item, 'Rejected.');
            return false;
        }
        this.statusCallback(this.item, 'Confirmed.');
        await this.delay(this.getRandomDelay());
        return true;
    }

    private async restaurantWorking(): Promise<boolean> {
        if (Math.random() < this.probabilityOfFailure) {
            this.statusCallback(this.item, 'Incomplete.');
            return false;
        }
        this.statusCallback(this.item, 'Preparing.');
        await this.delay(this.getRandomDelay());
        return true;
    }

    private async deliveryPersonPickedUp(): Promise<boolean> {
        if (Math.random() < this.probabilityOfFailure) {
            this.statusCallback(this.item, 'No pickup.');
            return false;
        }
        this.statusCallback(this.item, 'On way.');
        await this.delay(this.getRandomDelay());
        return true;
    }

    private async deliveryComplete(): Promise<boolean> {
        if (Math.random() < this.probabilityOfFailure) {
            this.statusCallback(this.item, 'Lost.');
            return false;
        }


        await this.delay(this.getRandomDelay());
        this.statusCallback(this.item, 'Complete!');
        return true;
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