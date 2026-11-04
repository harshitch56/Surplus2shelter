def calculate_trapezoidal(times, rates):

    total = 0
    intervals = []

    for i in range(len(times) - 1):

        h = times[i + 1] - times[i]

        area = h * (rates[i] + rates[i + 1]) / 2

        total += area

        intervals.append({
            "interval": f"{times[i]} - {times[i + 1]}",
            "food_collected": round(area, 3)
        })

    return total, intervals