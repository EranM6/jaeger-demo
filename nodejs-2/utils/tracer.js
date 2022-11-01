const opentelemetryApi = require('@opentelemetry/api');
const {registerInstrumentations} = require('@opentelemetry/instrumentation');
const {NodeTracerProvider} = require('@opentelemetry/sdk-trace-node');
const {Resource} = require('@opentelemetry/resources');
const {SemanticResourceAttributes} = require('@opentelemetry/semantic-conventions');
const {SimpleSpanProcessor, ConsoleSpanExporter} = require('@opentelemetry/sdk-trace-base');
const {OTLPTraceExporter} = require("@opentelemetry/exporter-trace-otlp-http");
const {getNodeAutoInstrumentations} = require("@opentelemetry/auto-instrumentations-node");
const {CompositePropagator} = require('@opentelemetry/core');
const {B3Propagator, B3InjectEncoding} = require('@opentelemetry/propagator-b3');
const {JaegerPropagator} = require('@opentelemetry/propagator-jaeger');
const {diag, DiagConsoleLogger, DiagLogLevel} = require('@opentelemetry/api');

const tracer = opentelemetryApi.trace.getTracer('http-example');

module.exports = {
    init() {

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
        diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

        const provider = new NodeTracerProvider({
            resource: new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: "nodejs service 2",
            }),
        });

        const PORT = process.env.JAEGER_AGENT_PORT || 4318;
        const HOST = process.env.JAEGER_AGENT_HOST || "localhost";

        const exporter = new OTLPTraceExporter({
            // optional - url default value is http://localhost:4318/v1/traces
            url: `http://${HOST}:${PORT}/v1/traces`,
            // optional - collection of custom headers to be sent with each request, empty by default
            headers: {},
        });

        provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
        // provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
        provider.register({
            propagator: new CompositePropagator({
                propagators: [
                    new JaegerPropagator(),
                    new B3Propagator(),
                    new B3Propagator({injectEncoding: B3InjectEncoding.MULTI_HEADER}),
                ],
            }),
        });

        registerInstrumentations({
            instrumentations: [getNodeAutoInstrumentations()]
        });
    },
    traceRequest(request, response, next) {
        const {logger} = require("./logger");
        const currentSpan = opentelemetryApi.trace.getSpan(opentelemetryApi.context.active());
        // display traceid in the terminal
        logger.debug(`traceid: ${currentSpan.spanContext().traceId}`);
        const span = tracer.startSpan('handleRequest', {
            kind: 1, // server
            attributes: {key: 'value'},
        });
        // Annotate our span to capture metadata about the operation
        span.addEvent('invoking handleRequest');

        const body = [];
        request.on('error', (err) => logger.error(err));
        request.on('data', (chunk) => body.push(chunk));
        request.on('end', () => {
            // deliberately sleeping to mock some action.
            setTimeout(() => {
                span.end();
                response.end('Hello World!');
            }, 2000);
        });
        next();
    }
}