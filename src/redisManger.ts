import { RedisClient, createClient } from "redis";
import { promisify } from "util";
require("dotenv").config();

/**
 * @property 0 - Queue name.
 * @property 1 - Task content.
 */
export type RedisTask = [string, string];

/**
 * Redis Manger is an abstract class that connects to redis and promisifies its functions
 */
export default abstract class RedisManger {
	/**
	 * Crete a new redis client
	 */
	public static readonly redisClient: RedisClient = createClient({
		password: process.env.REDIS_PASS || undefined,
	});

	/**
	 * Pop the first element of the queue, if there is no elements then block the promise untill
	 * it recives an element, 
	 * Note that: you need to recall the consumer after consumtion to keep alive
	 *
	 * @see blpop {@link https://redis.io/commands/blpop}
	 * @param {string} queue name of the queue that would be consumed
	 * @param {number} timeout number of miliseconds to timeout, 0 means never timeout
	 * @return {Promise<[string, string]>} the first string is the queue name and the second is the task
	 */
	public static readonly consumer: (
		queue: string,
		timeout: number
	) => Promise<RedisTask> = promisify(RedisManger.redisClient.blpop).bind(
		RedisManger.redisClient
	);

	/**
	 * Creates a queue if doesn't exist and push the task to the end of the queue
	 * @see rpush {@link https://redis.io/commands/rpush}
	 * 
	 * @param {string} queue name of the queue that would be created
	 * @param {string} task the task to be produced
	 * @return {Promise<boolean>} success or not
	 */
	public static readonly producer: (
		queue: string,
		task: string
	) => Promise<boolean> = promisify(RedisManger.redisClient.rpush).bind(
		RedisManger.redisClient
	);
}
