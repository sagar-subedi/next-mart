import kafka from '@packages/utils/kafka';
import { clients } from './main';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { logger } from './otel-logger';

const consumer = kafka.consumer({ groupId: 'log-events-group' });
const logQueue: string[] = [];

// Parse log level from log message
const getLogLevel = (logMessage: string): SeverityNumber => {
  const lowerLog = logMessage.toLowerCase();
  if (lowerLog.includes('error')) return SeverityNumber.ERROR;
  if (lowerLog.includes('warn')) return SeverityNumber.WARN;
  if (lowerLog.includes('info')) return SeverityNumber.INFO;
  if (lowerLog.includes('debug')) return SeverityNumber.DEBUG;
  return SeverityNumber.INFO;
};

// Process logs - send to both WebSocket clients AND Loki
const processLogs = () => {
  if (logQueue.length === 0) return;
  console.log(`Processing ${logQueue.length} logs in batch`);
  const logs = [...logQueue];
  logQueue.length = 0;

  logs.forEach((log) => {
    try {
      // Parse the log if it's JSON, otherwise use as-is
      const logData = (() => {
        try {
          return JSON.parse(log);
        } catch {
          return { message: log };
        }
      })();

      // Send to Loki via OpenTelemetry
      logger.logFromJson(logData);

      // Send to WebSocket clients (existing behavior)
      clients.forEach((client) => {
        client.send(log);
      });
    } catch (error) {
      console.error('Error processing log:', error);
    }
  });
};

setInterval(processLogs, 3000);

// Consume log messages from kafka
export const consumeKafkaMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'logs', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const log = message.value.toString();
      logQueue.push(log);
    },
  });
};

consumeKafkaMessages().catch(console.error);
