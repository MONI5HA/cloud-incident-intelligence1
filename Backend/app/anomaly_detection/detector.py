import numpy as np

class AnomalyDetector:

    def __init__(self):
        self.cpu_history = []
        self.latency_history = []

    def update(self, metrics):
        self.cpu_history.append(metrics["cpu_usage"])
        self.latency_history.append(metrics["latency"])

        # keep last 20 points only
        if len(self.cpu_history) > 20:
            self.cpu_history.pop(0)

        if len(self.latency_history) > 20:
            self.latency_history.pop(0)

        return self.detect(metrics)

    def detect(self, metrics):
        alerts = []

        # CPU anomaly
        if len(self.cpu_history) > 5:
            cpu_z = self.z_score(self.cpu_history, metrics["cpu_usage"])
            if abs(cpu_z) > 2:
                alerts.append("CPU anomaly detected")

        # Latency anomaly
        if len(self.latency_history) > 5:
            latency_z = self.z_score(self.latency_history, metrics["latency"])
            if abs(latency_z) > 2:
                alerts.append("Latency anomaly detected")

        # Error threshold rule (simple rule-based check)
        if metrics["error_rate"] > 10:
            alerts.append("High error rate detected")

        return {
            "metrics": metrics,
            "alerts": alerts,
            "status": "CRITICAL" if alerts else "NORMAL"
        }

    def z_score(self, history, value):
        mean = np.mean(history)
        std = np.std(history)

        if std == 0:
              return 0

        return (value - mean) / std