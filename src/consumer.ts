import express, { Express } from "express";
import RedisManger, { RedisTask } from "./redisManger";
require('dotenv').config();

const app: Express = express();

app.listen(process.env.CONSUMER_PORT, async function () {
	console.log(`Consumer is Listening on Port ${this.address().port}\n`);
	await consumeTask();
});

const consumeTask = async () => {
	let task: RedisTask;
	try {
		// get the consumed task
		task = await RedisManger.consumer(process.env.QUEUE_NAME, 0);

		// use try and catch to make sure that the consume task  will keep alive
		try {
			// the first element of the array is the queue name, 
			// while the second is the content
			doWork(task[1]);
		} catch (err) {
			console.error(err);
		}
		
		// the consumer exists after consumtions, 
		// so recusrive calling keeps the consumer alive
		return consumeTask();
	} catch (err) {
		console.error(err);
	}
};

const doWork = (task: string) => {
	task = JSON.parse(task);
	console.info(`${task} is consumed successfully`);
};
