import { min } from "d3";

export class BinaryHeap<T> {
    storage: T[];
    minComparator: (a: T, b: T) => boolean;

    constructor(minComparator: (a: T, b: T) => boolean) {
        this.minComparator = minComparator;
        this.storage = []
    }

    push(element: T) {
        this.storage.push(element);
        this.siftUp(this.storage.length-1);
    }

    pop(): T {
        let temp = this.storage[0]
        this.storage[0] = this.storage[this.storage.length - 1];
        this.storage.pop();
        if(this.storage.length > 0){
            this.siftDown(0);
        }
        return temp;
    }

    decreaseKey(element: T) {
        for(let i = 0 ; i < this.storage.length; ++i) {
            if(this.storage[i] == element) {
                this.siftUp(i);
                break;
            } 
        }
    }

    get length(): number {
        return this.storage.length;
    }

    private siftUp(n: number) {
        let curr = n;
        while(curr > 0) {
            let parent = Math.floor((n+1)/2)-1;
            if(!this.minComparator(this.storage[curr], this.storage[parent])){
                break;
            }
            let temp = this.storage[parent];
            this.storage[parent] = this.storage[curr];
            this.storage[curr] = temp;
            curr = parent;
        }
    }

    private siftDown(n: number) {
        let curr = n;
        while(curr < this.storage.length) {
            let toSwap = curr;
            if(2*curr+1 < this.storage.length && 
                this.minComparator(this.storage[2*curr+1], this.storage[toSwap])){
                toSwap = 2*curr+1
            }
            if(2*curr+2 < this.storage.length && 
                this.minComparator(this.storage[2*curr+2], this.storage[toSwap])){
                toSwap = 2*curr+2
            }
            if(toSwap === curr) {
                break
            }
            let temp = this.storage[toSwap];
            this.storage[toSwap] = this.storage[curr]
            this.storage[curr] = temp;
            curr = toSwap;
        }
    }
}