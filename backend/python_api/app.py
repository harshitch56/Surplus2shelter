from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from methods.trapezoidal import calculate_trapezoidal

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "Python Backend Running"
    })

@app.route("/api/trapezoidal", methods=["POST"])
def trapezoidal():
    try:
        data = request.get_json()
        times = data["times"]
        rates = data["rates"]

        total, intervals = calculate_trapezoidal(times, rates)

        return jsonify({
            "success": True,
            "total_food_collected": round(total, 3),
            "unit": "kg",
            "intervals": intervals
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400



@app.route("/api/bisection", methods=["POST"])
def bisection():
    data = request.get_json()

    a = float(data["a"])
    b = float(data["b"])
    tol = float(data.get("tolerance", 0.0001))

    def f(x):
        return x**3 - x - 2

    if f(a) * f(b) >= 0:
        return jsonify({
            "success": False,
            "error": "Invalid interval"
        }), 400

    iterations = 0

    while (b - a) / 2 > tol and iterations < 1000:
        c = (a + b) / 2

        if f(c) == 0:
            a = b = c
            break
        elif f(a) * f(c) < 0:
            b = c
        else:
            a = c

        iterations += 1

    return jsonify({
        "success": True,
        "root": (a + b) / 2,
        "iterations": iterations,
        "equation": "x^3 - x - 2"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001))
    )