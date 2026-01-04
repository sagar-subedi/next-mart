import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { 
  LoggerProvider, 
  BatchLogRecordProcessor 
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

// Create OTLP exporter
const logExporter = new OTLPLogExporter({
    url: 'http://localhost:4317'
  });

// Create resource
const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'websocket-log-service',
  });

// Create logger provider with processors in the constructor
const loggerProvider = new LoggerProvider({
  resource: resource,
  processors: [
    new BatchLogRecordProcessor(logExporter, {
      maxQueueSize: 1000,
      maxExportBatchSize: 100,
      scheduledDelayMillis: 5000,
    })
  ],
});

// Set as global logger provider
logs.setGlobalLoggerProvider(loggerProvider);

// Get logger instance
const otelLogger = loggerProvider.getLogger('kafka-consumer', '1.0.0');

// Helper to map string levels to severity numbers
const getSeverityFromLevel = (level?: string): SeverityNumber => {
  if (!level) return SeverityNumber.INFO;
  
  const levelLower = level.toLowerCase();
  switch (levelLower) {
    case 'trace':
      return SeverityNumber.TRACE;
    case 'debug':
      return SeverityNumber.DEBUG;
    case 'info':
      return SeverityNumber.INFO;
    case 'warn':
    case 'warning':
      return SeverityNumber.WARN;
    case 'error':
      return SeverityNumber.ERROR;
    case 'fatal':
      return SeverityNumber.FATAL;
    default:
      return SeverityNumber.INFO;
  }
};

// Create convenient wrapper
export const logger = {
  trace: (message: string, attributes?: Record<string, any>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.TRACE,
      severityText: 'TRACE',
      body: message,
      attributes: attributes || {},
    });
  },

  debug: (message: string, attributes?: Record<string, any>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.DEBUG,
      severityText: 'DEBUG',
      body: message,
      attributes: attributes || {},
    });
  },

  info: (message: string, attributes?: Record<string, any>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'INFO',
      body: message,
      attributes: attributes || {},
    });
  },

  warn: (message: string, attributes?: Record<string, any>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: 'WARN',
      body: message,
      attributes: attributes || {},
    });
  },

  error: (message: string, attributes?: Record<string, any>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: message,
      attributes: attributes || {},
    });
  },

  fatal: (message: string, attributes?: Record<string, any>) => {
    otelLogger.emit({
      severityNumber: SeverityNumber.FATAL,
      severityText: 'FATAL',
      body: message,
      attributes: attributes || {},
    });
  },

  // Helper to log from parsed JSON
  logFromJson: (logData: any) => {
    const level = logData.level || 'info';
    const message = logData.message || JSON.stringify(logData);
    const attributes = {
      source: 'kafka',
      timestamp: logData.timestamp || new Date().toISOString(),
      ...(logData.metadata || {}),
    };

    otelLogger.emit({
      severityNumber: getSeverityFromLevel(level),
      severityText: level.toUpperCase(),
      body: message,
      attributes,
    });
    console.log(`Logged [${level.toUpperCase()}]: ${message}`);
  },
};

// Graceful shutdown
export const shutdownLogger = async () => {
  await loggerProvider.shutdown();
};

process.on('SIGTERM', shutdownLogger);
process.on('SIGINT', shutdownLogger);