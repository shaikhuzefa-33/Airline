import os
import random
import datetime
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='templates', static_folder='static')

AIRPORTS = {
    "LHR": {"city": "London", "name": "London Heathrow", "country": "United Kingdom", "flag": "🇬🇧"},
    "DXB": {"city": "Dubai", "name": "Dubai International", "country": "United Arab Emirates", "flag": "🇦🇪"},
    "JFK": {"city": "New York", "name": "John F. Kennedy", "country": "United States", "flag": "🇺🇸"},
    "HND": {"city": "Tokyo", "name": "Haneda Airport", "country": "Japan", "flag": "🇯🇵"},
    "CDG": {"city": "Paris", "name": "Charles de Gaulle", "country": "France", "flag": "🇫🇷"},
    "SIN": {"city": "Singapore", "name": "Changi Airport", "country": "Singapore", "flag": "🇸🇬"},
    "BOM": {"city": "Mumbai", "name": "Chhatrapati Shivaji Maharaj", "country": "India", "flag": "🇮🇳"},
    "SYD": {"city": "Sydney", "name": "Sydney Kingsford Smith", "country": "Australia", "flag": "🇦🇺"},
    "FCO": {"city": "Rome", "name": "Leonardo da Vinci–Fiumicino", "country": "Italy", "flag": "🇮🇹"},
    "ZRH": {"city": "Zurich", "name": "Zurich Airport", "country": "Switzerland", "flag": "🇨🇭"},
    "BKK": {"city": "Bangkok", "name": "Suvarnabhumi Airport", "country": "Thailand", "flag": "🇹🇭"},
    "CAI": {"city": "Cairo", "name": "Cairo International", "country": "Egypt", "flag": "🇪🇬"},
    "YYZ": {"city": "Toronto", "name": "Toronto Pearson", "country": "Canada", "flag": "🇨🇦"},
    "IST": {"city": "Istanbul", "name": "Istanbul Airport", "country": "Turkey", "flag": "🇹🇷"},
    "CPT": {"city": "Cape Town", "name": "Cape Town International", "country": "South Africa", "flag": "🇿🇦"},
    "FRA": {"city": "Frankfurt", "name": "Frankfurt Airport", "country": "Germany", "flag": "🇩🇪"}
}

AIRCRAFT_TYPES = [
    {"model": "Airbus A350-1000", "code": "A351", "wifi": True, "suite": True},
    {"model": "Boeing 777X Huzefa Flagship", "code": "B77X", "wifi": True, "suite": True},
    {"model": "Boeing 787-10 Dreamliner", "code": "B781", "wifi": True, "suite": False}
]

# Modular Page Routes
@app.route('/')
def home_module():
    return render_template('index.html', active_page='home')

@app.route('/flights')
def flights_module():
    return render_template('flights.html', active_page='flights')

@app.route('/destinations')
def destinations_module():
    return render_template('destinations.html', active_page='destinations')

@app.route('/offers')
def offers_module():
    return render_template('offers.html', active_page='offers')

@app.route('/about')
def about_module():
    return render_template('about.html', active_page='about')

@app.route('/contact')
def contact_module():
    return render_template('contact.html', active_page='contact')

@app.route('/status')
def status_module():
    return render_template('status.html', active_page='status')

@app.route('/login')
def login_module():
    return render_template('login.html', active_page='login')

@app.route('/signup')
def signup_module():
    return render_template('signup.html', active_page='signup')

@app.route('/admin')
def admin_module():
    return render_template('admin.html', active_page='admin')

# REST API Endpoints
@app.route('/api/airports', methods=['GET'])
def get_airports():
    return jsonify({"status": "success", "airports": AIRPORTS})

@app.route('/api/flights/search', methods=['POST'])
def search_flights():
    data = request.json or {}
    origin = data.get('origin', 'LHR').upper()
    destination = data.get('destination', 'DXB').upper()
    date_str = data.get('date', datetime.date.today().isoformat())
    passengers = int(data.get('passengers', 1))
    cabin_class = data.get('cabinClass', 'economy')

    random.seed(f"{origin}-{destination}-{date_str}")
    flights = []
    flight_count = random.randint(3, 5)
    times = [("06:15", "14:30"), ("10:45", "19:00"), ("14:20", "22:45"), ("21:30", "05:45 +1")]
    base_price = 450 if cabin_class == 'economy' else (1250 if cabin_class == 'business' else 3800)

    for i in range(flight_count):
        dep, arr = times[i % len(times)]
        aircraft = random.choice(AIRCRAFT_TYPES)
        flight_num = f"HZ-{random.randint(100, 999)}"

        flights.append({
            "id": f"FL-{origin}-{destination}-{i+101}",
            "flightNumber": flight_num,
            "origin": origin,
            "originDetails": AIRPORTS.get(origin, {"city": origin, "name": origin}),
            "destination": destination,
            "destinationDetails": AIRPORTS.get(destination, {"city": destination, "name": destination}),
            "departureTime": dep,
            "arrivalTime": arr,
            "duration": f"{random.randint(6, 12)}h 30m",
            "stops": "Direct" if i != 2 else "1 Stop",
            "aircraft": aircraft["model"],
            "hasWifi": aircraft["wifi"],
            "hasFirstSuite": aircraft["suite"],
            "price": base_price + (i * 75) + random.randint(-30, 60),
            "currency": "USD",
            "seatsLeft": random.randint(3, 12)
        })

    return jsonify({"status": "success", "flights": flights})

@app.route('/api/seats/<flight_id>', methods=['GET'])
def get_seats(flight_id):
    random.seed(flight_id)
    seats = []
    for row in range(1, 3):
        for col in ['A', 'D', 'G', 'K']:
            seats.append({"seatNumber": f"{row}{col}", "class": "first", "status": 'occupied' if random.random() < 0.3 else 'available', "priceExtra": 450})
    for row in range(4, 9):
        for col in ['A', 'D', 'G', 'K']:
            seats.append({"seatNumber": f"{row}{col}", "class": "business", "status": 'occupied' if random.random() < 0.4 else 'available', "priceExtra": 180})
    for row in range(10, 20):
        for col in ['A', 'B', 'C', 'D', 'E', 'F']:
            seats.append({"seatNumber": f"{row}{col}", "class": "economy", "status": 'occupied' if random.random() < 0.45 else 'available', "priceExtra": 0})

    return jsonify({"status": "success", "flightId": flight_id, "seats": seats})

@app.route('/api/bookings/create', methods=['POST'])
def create_booking():
    data = request.json or {}
    booking_ref = f"HZ{''.join([str(random.randint(0, 9)) for _ in range(6)])}"
    booking = {
        "bookingRef": booking_ref,
        "passengerName": data.get('passengerName', 'Valued Guest').upper(),
        "flightNumber": data.get('flight', {}).get('flightNumber', 'HZ-777'),
        "origin": data.get('flight', {}).get('origin', 'LHR'),
        "destination": data.get('flight', {}).get('destination', 'DXB'),
        "seats": data.get('selectedSeats', ['1A']),
        "totalPrice": data.get('totalPrice', '$1,250'),
        "gate": f"B{random.randint(12, 45)}"
    }
    return jsonify({"status": "success", "booking": booking})

if __name__ == '__main__':
    print("Huzefa Airlines Modular Server running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
