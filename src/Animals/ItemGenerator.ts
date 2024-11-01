import Animal from './Animal';

class ItemGenerator {
    private items: Animal[] = [
        { name: 'Cat', location: 'land' }, { name: 'Dog', location: 'land' }, { name: 'Elephant', location: 'land' },
        { name: 'Giraffe', location: 'land' }, { name: 'Lion', location: 'land' }, { name: 'Tiger', location: 'land' },
        { name: 'Zebra', location: 'land' }, { name: 'Bear', location: 'land' }, { name: 'Wolf', location: 'land' },
        { name: 'Fox', location: 'land' }, { name: 'Rabbit', location: 'land' }, { name: 'Deer', location: 'land' },
        { name: 'Horse', location: 'land' }, { name: 'Cow', location: 'land' }, { name: 'Sheep', location: 'land' },
        { name: 'Goat', location: 'land' }, { name: 'Chicken', location: 'land' }, { name: 'Duck', location: 'water' },
        { name: 'Goose', location: 'water' }, { name: 'Pigeon', location: 'sky' }, { name: 'Parrot', location: 'sky' },
        { name: 'Sparrow', location: 'sky' }, { name: 'Eagle', location: 'sky' }, { name: 'Falcon', location: 'sky' },
        { name: 'Hawk', location: 'sky' }, { name: 'Owl', location: 'sky' }, { name: 'Penguin', location: 'land' },
        { name: 'Peacock', location: 'land' }, { name: 'Flamingo', location: 'water' }, { name: 'Swan', location: 'water' },
        { name: 'Alligator', location: 'water' }, { name: 'Crocodile', location: 'water' }, { name: 'Snake', location: 'land' },
        { name: 'Lizard', location: 'land' }, { name: 'Frog', location: 'water' }, { name: 'Toad', location: 'land' },
        { name: 'Turtle', location: 'water' }, { name: 'Tortoise', location: 'land' }, { name: 'Whale', location: 'water' },
        { name: 'Dolphin', location: 'water' }, { name: 'Shark', location: 'water' }, { name: 'Octopus', location: 'water' },
        { name: 'Squid', location: 'water' }, { name: 'Crab', location: 'water' }, { name: 'Lobster', location: 'water' },
        { name: 'Starfish', location: 'water' }, { name: 'Jellyfish', location: 'water' }, { name: 'Seal', location: 'water' },
        { name: 'Walrus', location: 'water' }, { name: 'Otter', location: 'water' }, { name: 'Beaver', location: 'water' },
        { name: 'Kangaroo', location: 'land' }, { name: 'Koala', location: 'land' }, { name: 'Panda', location: 'land' },
        { name: 'Raccoon', location: 'land' }, { name: 'Skunk', location: 'land' }, { name: 'Moose', location: 'land' },
        { name: 'Bison', location: 'land' }, { name: 'Buffalo', location: 'land' }, { name: 'Chimpanzee', location: 'land' },
        { name: 'Gorilla', location: 'land' }, { name: 'Orangutan', location: 'land' }, { name: 'Baboon', location: 'land' },
        { name: 'Lemur', location: 'land' }, { name: 'Meerkat', location: 'land' }, { name: 'Hyena', location: 'land' },
        { name: 'Cheetah', location: 'land' }, { name: 'Leopard', location: 'land' }, { name: 'Panther', location: 'land' },
        { name: 'Jaguar', location: 'land' }, { name: 'Hippopotamus', location: 'water' }, { name: 'Rhinoceros', location: 'land' },
        { name: 'Antelope', location: 'land' }, { name: 'Gazelle', location: 'land' }, { name: 'Ibex', location: 'land' },
        { name: 'Camel', location: 'land' }, { name: 'Donkey', location: 'land' }, { name: 'Zebu', location: 'land' },
        { name: 'Yak', location: 'land' }, { name: 'Alpaca', location: 'land' }, { name: 'Guinea Pig', location: 'land' },
        { name: 'Hamster', location: 'land' }, { name: 'Mouse', location: 'land' }, { name: 'Rat', location: 'land' },
        { name: 'Squirrel', location: 'land' }, { name: 'Chipmunk', location: 'land' }, { name: 'Bat', location: 'sky' },
        { name: 'Mole', location: 'land' }, { name: 'Hedgehog', location: 'land' }, { name: 'Armadillo', location: 'land' },
        { name: 'Porcupine', location: 'land' }, { name: 'Sloth', location: 'land' }, { name: 'Anteater', location: 'land' },
        { name: 'Aardvark', location: 'land' }, { name: 'Wombat', location: 'land' }
    ];

    public async getItem(i: number): Promise<Animal> {
        const delay = Math.floor(Math.random() * 3000) + 1000; // Random delay between 1-4 seconds
        return new Promise((resolve) => {
            setTimeout(() => {

                resolve(this.items[i % this.items.length]);

            }, delay);
        });
    }
}

export default ItemGenerator;
