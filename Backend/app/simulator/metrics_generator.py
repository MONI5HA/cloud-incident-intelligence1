import random


def generate_metrics():
    traffic_spike = random.choice([True, False, False, False])

    request_rate = random.randint(100, 500)

    if traffic_spike:
        request_rate += random.randint(500, 1500)

    cpu_usage = min(95, request_rate / 20 + random.uniform(10, 30))

    latency = min(5000, request_rate * random.uniform(1.5, 4))

    error_rate = 0

    if cpu_usage > 80:
        error_rate = random.uniform(5, 20)

    metrics = {
        "cpu_usage": round(cpu_usage, 2),
        "memory_usage": round(random.uniform(40, 85), 2),
        "latency": round(latency, 2),
        "request_rate": request_rate,
        "error_rate": round(error_rate, 2),
        "traffic_spike": traffic_spike
    }

    return metrics