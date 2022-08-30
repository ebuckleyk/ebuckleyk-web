import * as app from 'applicationinsights';
import { SeverityLevel } from 'applicationinsights/out/Declarations/Contracts';
app
  .setup()
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true, false)
  .setUseDiskRetryCaching(true)
  .setAutoCollectPreAggregatedMetrics(true)
  .setSendLiveMetrics(true)
  .setAutoCollectHeartbeat(false)
  .setInternalLogging(false, true)
  .setDistributedTracingMode(app.DistributedTracingModes.AI_AND_W3C)
  .enableAutoWebSnippetInjection(false);
app.defaultClient.context.tags[app.defaultClient.context.keys.cloudRole] =
  'ebuckleyk-web';
app.start();

const withApplicationInsights = (handler) => async (req, res) => {
  const correlationContext = app.startOperation(req);
  return app.wrapWithCorrelationContext(async () => {
    const startTime = Date.now();

    try {
      const result = await handler(req, res, app);

      app.defaultClient.trackRequest({
        name: `${req.method} ${req.url}`,
        url: req.url,
        resultCode: res.statusCode,
        success: res.statusCode < 400,
        properties: res?.statusCode >= 400 ? res?.body : undefined,
        duration: Date.now() - startTime,
        id: correlationContext.operation.parentId
      });

      return result;
    } catch (error) {
      app.defaultClient.trackException({
        exception: error,
        severity: SeverityLevel.Error
      });
    } finally {
      app.defaultClient.flush();
    }
  }, correlationContext)();
};

export default withApplicationInsights;
