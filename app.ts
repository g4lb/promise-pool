class PromisePoll<T> {
    private readonly queue: (() => Promise<T>)[]

    constructor(){
        this.queue = []
    }

    add(f: () => Promise<T>) {
        this.queue.push(f)
    }

    async getResults(maxConcurrent: number) : Promise<T[]> {
        const getResultsResponse = []
        while(this.queue.length > 0){
            const currentPromises: (Promise<T>)[] = [];
            while(currentPromises.length < maxConcurrent){
                const promiseShift: (() => Promise<T>) = this.queue.shift()
                currentPromises.push(promiseShift())
            }
            const result = await Promise.all(currentPromises)
             getResultsResponse.push(...result)
        }
        return getResultsResponse
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("Started.");

    const runner = new PromisePoll<number>();


    for (let i = 0 ; i < 100; ++i) {
        runner.add(async () => {
            console.log(`Printing ${i}`);
            await sleep(1000);
            return i;
        });
    }

    const results = await runner.getResults(10);

    console.log("Results:");
    console.log(results);
    console.log("Done.");
}

main();