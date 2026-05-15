class RecommendationEngine:

    def generate(self, metrics, alerts, root_causes):

        recommendations = []

        cpu = metrics["cpu_usage"]
        latency = metrics["latency"]
        errors = metrics["error_rate"]
        requests = metrics["request_rate"]

        # High traffic
        if requests > 1200:
            recommendations.append("Enable autoscaling to handle traffic spike")

        # CPU overload
        if cpu > 85:
            recommendations.append("Scale up CPU resources or increase pod replicas")

        # Latency issue
        if latency > 2500:
            recommendations.append("Add caching layer or optimize database queries")

        # High errors
        if errors > 10:
            recommendations.append("Check logs and restart failing services")

        # Severe condition
        if cpu > 90 and latency > 3000:
            recommendations.append("URGENT: Consider load balancing and horizontal scaling")

        if not recommendations:
            recommendations.append("System healthy — no action required")

        return recommendations