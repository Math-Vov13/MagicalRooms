class Node {
    data: any
    next: Node | null

    constructor(data: any) {
        this.data = data;
        this.next = null;
    }
}

export class Queue {
    front: Node | null
    rear: Node | null
    size: number

    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    enqueue(data: any) {
        // Ajoute un élément à la queue
        const newNode = new Node(data);
        if (this.isEmpty()) {
            this.front = newNode;
            this.rear = newNode;
        } else {
            (this.rear as Node).next = newNode;
            this.rear = newNode;
        }
        this.size++;
    }

    dequeue(): any {
        // Retire le premier élément
        if (this.isEmpty()) {
            return null;
        }
        const firstNode = this.front as Node;
        this.front = firstNode.next;
        if (this.front === null) {
            this.rear = null;
        }
        this.size--;
        return firstNode.data;
    }

    isEmpty(): boolean {
        // Si la queue est vide
        return this.size === 0;
    }

    getSize() {
        // Taille de la queue
        return this.size;
    }

    isInQueue(key: string, value: any): boolean {
        // Vérifie si l'élément est dans la queue
        let current = this.front;
        while (current) {
            if (current.data[key] === value) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    remove(key: string, value: any): Node | null {
        // Enlève un élément dans la queue
        let last = null;
        let current = this.front;
        while (current) {
            if (current.data[key] === value) {
                if (!last){
                    return this.dequeue(); // la queue ne contient qu'un seul élément...
                }

                if (this.rear === current) {
                    this.rear = last; // Change la dernière valeur de la queue
                }

                last.next = current.next;
                this.size--;
                return current.data;
            }
            last = current
            current = current.next;
        }
        return null;
    }

    print() {
        // Affiche la queue dans la console
        let current = this.front;
        const elements = [];
        while (current) {
            elements.push(current.data);
            current = current.next;
        }
        console.log(elements.join(' -> '));
    }
}