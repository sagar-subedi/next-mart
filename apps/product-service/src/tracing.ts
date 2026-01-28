import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'product-service',
    }),
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4317',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();