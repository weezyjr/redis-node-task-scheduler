import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import RedisManger from "./redisManger";
require("dotenv").config();

const app: Express = express();
app.use(bodyParser.json());

app.listen(process.env.PRODUCER_PORT, function () {
	console.log(`Producer is Listening on Port ${this.address().port}\n`);
});

app.post("/", async (req: Request, res: Response) => {
	try {
		// get the task from the body
		const task = JSON.stringify(req.body.task);

		// create a queue if does not exist and push the task to its end
		await RedisManger.producer(process.env.QUEUE_NAME, task);

		// notify that the task is produced
		console.info(`${task} is produced successfully`);
		return res.json({ message: `${task} is produced` });
	} catch (err) {
		console.error(err);
	}
});
