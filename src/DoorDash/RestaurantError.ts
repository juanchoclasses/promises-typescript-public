// RestaurantError.ts
export class RestaurantError extends Error {
    public item: string;
    public explanation: string;

    constructor(item: string, reason: string) {
        super(`${item}: ${reason}`);
        this.item = item;
        this.explanation = reason;
        this.name = 'RestaurantError';
    }
}