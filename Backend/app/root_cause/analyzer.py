class RootCauseAnalyzer:

    def analyze(self, metrics, alerts):

        causes = []

        cpu = metrics["cpu_usage"]
        latency = metrics["latency"]
        errors = metrics["error_rate"]
        requests = metrics["request_rate"]

        # Traffic spike causing CPU pressure
        if requests > 1200 and cpu > 80:
            causes.append(
                "High traffic spike likely caused CPU overload"
            )

        # CPU overload causing latency
        if cpu > 85 and latency > 2500:
            causes.append(
                "High CPU usage likely increased API latency"
            )

        # Severe instability
        if errors > 10 and latency > 3000:
            causes.append(
                "Service instability detected due to high latency and failures"
            )

        # General overload
        if cpu > 90 and errors > 15:
            causes.append(
                "System overload likely causing request failures"
            )

        if not causes and alerts:
            causes.append(
                "Anomaly detected but root cause is uncertain"
            )

        return causes