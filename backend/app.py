"""
Smart Livestock / Poultry Farm Management System - Backend API
==============================================================
Run: python app.py

Database: Create a .env file in the backend folder with:
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/livestock_db
(Or use env var / local MongoDB)
"""

from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass  # python-dotenv not installed, use env vars only

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, OperationFailure, PyMongoError
from bson import ObjectId
from datetime import datetime
import hashlib
import os

app = Flask(__name__)
# Enable CORS so frontend (React) can call our API
CORS(app)

# MongoDB: loads from .env file, or MONGODB_URI env var, or default localhost
# Set MONGODB_URI for MongoDB Atlas (free at mongodb.com/atlas) - no local install needed
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client["livestock_db"]

# Collections
users_collection = db["users"]
animals_collection = db["animals"]
sales_collection = db["sales"]


def init_default_user():
    """Insert default admin user if not exists"""
    if users_collection.count_documents({}) == 0:
        # Simple password hash (for demo - use bcrypt in production)
        password_hash = hashlib.sha256("1234".encode()).hexdigest()
        users_collection.insert_one({
            "username": "admin",
            "password": password_hash,
            "created_at": datetime.utcnow()
        })
        print("Default user created: admin / 1234")


def init_database():
    """Initialize database with default data if empty"""
    init_default_user()
    # Add sample animal if empty (for demo)
    if animals_collection.count_documents({}) == 0:
        animals_collection.insert_one({
            "tag_id": "CHICK-001",
            "species": "Chicken",
            "breed": "Rhode Island Red",
            "age_months": 3,
            "weight_kg": 1.2,
            "health_status": "healthy",
            "temperature": 40.5,
            "notes": "Sample chicken",
            "created_at": datetime.utcnow()
        })
        print("Sample animal created for demo")


# ==================== HELPER ====================
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def to_serializable(obj):
    """Convert MongoDB ObjectId to string for JSON"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_serializable(i) for i in obj]
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj


# ==================== AUTH ====================
@app.route("/api/login", methods=["POST"])
def login():
    """
    Login API - accepts { "username": "...", "password": "..." }
    Returns success and user info, or error
    """
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    username = data["username"]
    password = data["password"]
    password_hash = hash_password(password)

    user = users_collection.find_one({"username": username, "password": password_hash})
    if not user:
        return jsonify({"success": False, "message": "Invalid username or password"}), 401

    return jsonify({
        "success": True,
        "user": {"username": user["username"]},
        "message": "Login successful"
    })


@app.route("/api/register", methods=["POST"])
def register():
    """
    Register API - accepts { "username": "...", "password": "..." }
    Creates new user in database
    """
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    username = data["username"].strip()
    password = data["password"]

    if not username or len(password) < 4:
        return jsonify({"success": False, "message": "Username required, password at least 4 characters"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"success": False, "message": "Username already exists"}), 400

    password_hash = hash_password(password)
    users_collection.insert_one({
        "username": username,
        "password": password_hash,
        "created_at": datetime.utcnow()
    })

    return jsonify({
        "success": True,
        "message": "Registration successful. Please login."
    }), 201


# ==================== DASHBOARD ====================
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    """
    Dashboard API - returns summary stats:
    - total_animals
    - average_temperature
    - unhealthy_count
    - sales_total
    """
    total_animals = animals_collection.count_documents({})

    # Average temperature from animals that have temperature
    animals_with_temp = list(animals_collection.find({"temperature": {"$exists": True, "$ne": None}}))
    avg_temp = 0
    if animals_with_temp:
        temps = [a.get("temperature", 0) for a in animals_with_temp if a.get("temperature")]
        avg_temp = round(sum(temps) / len(temps), 1) if temps else 0

    unhealthy_count = animals_collection.count_documents({"health_status": {"$in": ["unhealthy", "sick", "critical"]}})

    # Sales total
    sales_cursor = sales_collection.aggregate([{"$group": {"_id": None, "total": {"$sum": "$amount"}}}])
    sales_total = 0
    for doc in sales_cursor:
        sales_total = doc["total"]
        break

    return jsonify({
        "total_animals": total_animals,
        "average_temperature": avg_temp,
        "unhealthy_count": unhealthy_count,
        "sales_total": round(sales_total, 2)
    })


# ==================== ANIMALS ====================
@app.route("/api/animals", methods=["GET"])
def get_animals():
    """Get all animals"""
    animals = list(animals_collection.find())
    return jsonify(to_serializable(animals))


@app.route("/api/animals", methods=["POST"])
def add_animal():
    """
    Add new animal - expects JSON body with:
    tag_id, species, breed, age_months, weight_kg, health_status, temperature, notes
    """
    data = request.get_json()
    if not data or "tag_id" not in data:
        return jsonify({"success": False, "message": "tag_id is required"}), 400

    # Check duplicate tag_id
    if animals_collection.find_one({"tag_id": data["tag_id"]}):
        return jsonify({"success": False, "message": "Animal with this tag_id already exists"}), 400

    animal = {
        "tag_id": data["tag_id"],
        "species": data.get("species", "Chicken"),
        "breed": data.get("breed", ""),
        "age_months": int(data.get("age_months", 0)),
        "weight_kg": float(data.get("weight_kg", 0)),
        "health_status": data.get("health_status", "healthy"),
        "temperature": float(data.get("temperature", 40.0)),
        "notes": data.get("notes", ""),
        "created_at": datetime.utcnow()
    }
    result = animals_collection.insert_one(animal)
    animal["_id"] = str(result.inserted_id)
    return jsonify(to_serializable(animal)), 201


@app.route("/api/animals/<id>", methods=["PUT"])
def update_animal(id):
    """Update animal by _id"""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400

    try:
        oid = ObjectId(id)
    except Exception:
        return jsonify({"success": False, "message": "Invalid animal ID"}), 400

    update_fields = {}
    allowed = ["tag_id", "species", "breed", "age_months", "weight_kg", "health_status", "temperature", "notes"]
    for key in allowed:
        if key in data:
            update_fields[key] = data[key]

    if not update_fields:
        return jsonify({"success": False, "message": "No valid fields to update"}), 400

    result = animals_collection.update_one({"_id": oid}, {"$set": update_fields})
    if result.matched_count == 0:
        return jsonify({"success": False, "message": "Animal not found"}), 404

    animal = animals_collection.find_one({"_id": oid})
    return jsonify(to_serializable(animal))


@app.route("/api/animals/tag/<tag_id>", methods=["GET"])
def get_animal_by_tag(tag_id):
    """Get animal by tag_id (for Scan Tag feature)"""
    animal = animals_collection.find_one({"tag_id": tag_id})
    if not animal:
        return jsonify({"success": False, "message": "Animal not found"}), 404
    return jsonify(to_serializable(animal))


# ==================== SALES ====================
@app.route("/api/sales", methods=["GET"])
def get_sales():
    """Get all sales records"""
    sales = list(sales_collection.find().sort("date", -1))
    return jsonify(to_serializable(sales))


@app.route("/api/sales", methods=["POST"])
def add_sale():
    """
    Add sale - expects: description, amount, quantity, date (optional)
    """
    data = request.get_json()
    if not data or "amount" not in data:
        return jsonify({"success": False, "message": "amount is required"}), 400

    sale = {
        "description": data.get("description", "Sale"),
        "amount": float(data["amount"]),
        "quantity": int(data.get("quantity", 1)),
        "date": data.get("date", datetime.utcnow().strftime("%Y-%m-%d")),
        "created_at": datetime.utcnow()
    }
    result = sales_collection.insert_one(sale)
    sale["_id"] = str(result.inserted_id)
    return jsonify(to_serializable(sale)), 201


# ==================== PROFIT ====================
@app.route("/api/profit", methods=["GET"])
def get_profit():
    """
    Profit summary - total sales, could extend to costs later
    """
    sales_cursor = sales_collection.aggregate([{"$group": {"_id": None, "total": {"$sum": "$amount"}}}])
    sales_total = 0
    for doc in sales_cursor:
        sales_total = doc["total"]
        break

    # For demo, we don't have costs - profit = sales
    return jsonify({
        "sales_total": round(sales_total, 2),
        "costs_total": 0,
        "profit": round(sales_total, 2)
    })


# ==================== REPORTS ====================
@app.route("/api/reports", methods=["GET"])
def get_reports():
    """
    Reports - aggregated data for reports page
    """
    total_animals = animals_collection.count_documents({})
    total_sales = sales_collection.count_documents({})

    # Species breakdown
    species_pipeline = [{"$group": {"_id": "$species", "count": {"$sum": 1}}}]
    species_breakdown = list(animals_collection.aggregate(species_pipeline))

    # Health breakdown
    health_pipeline = [{"$group": {"_id": "$health_status", "count": {"$sum": 1}}}]
    health_breakdown = list(animals_collection.aggregate(health_pipeline))

    sales_cursor = sales_collection.aggregate([{"$group": {"_id": None, "total": {"$sum": "$amount"}}}])
    sales_total = 0
    for doc in sales_cursor:
        sales_total = doc["total"]
        break

    return jsonify({
        "total_animals": total_animals,
        "total_sales_count": total_sales,
        "sales_total_amount": round(sales_total, 2),
        "species_breakdown": to_serializable(species_breakdown),
        "health_breakdown": to_serializable(health_breakdown)
    })


# ==================== ERROR HANDLER ====================
@app.errorhandler(Exception)
def handle_error(e):
    """Return JSON error instead of HTML so frontend can show it"""
    msg = str(e)
    if isinstance(e, OperationFailure):
        if "auth" in msg.lower():
            return jsonify({"message": "MongoDB auth failed - check .env password"}), 500
        return jsonify({"message": f"MongoDB error: {msg}"}), 500
    if isinstance(e, PyMongoError):
        return jsonify({"message": f"Database error: {msg}"}), 500
    return jsonify({"message": msg or "Server error"}), 500


# ==================== RUN ====================
if __name__ == "__main__":
    try:
        client.admin.command("ping")
    except OperationFailure as e:
        if "auth" in str(e).lower():
            print("\n*** MongoDB auth failed - wrong username or password! ***")
            print("Edit backend/.env - check MONGODB_URI has correct password.")
            print("If password has @ # % etc, URL-encode: @ -> %40, # -> %23\n")
        raise SystemExit(1)
    except ServerSelectionTimeoutError:
        print("\n*** MongoDB connection failed! ***")
        if "YOUR_PASSWORD" in MONGODB_URI:
            print("Edit backend/.env - replace YOUR_PASSWORD with your actual Atlas password.")
        elif "localhost" in MONGODB_URI:
            print("Local MongoDB not running. Use Atlas: edit backend/.env with your connection string.")
        else:
            print("Check backend/.env - ensure MONGODB_URI has correct password.")
        print("Get connection string from mongodb.com/atlas\n")
        raise SystemExit(1)
    init_database()
    print("Backend running at http://localhost:5000")
    print("API docs: /api/login, /api/dashboard, /api/animals, /api/sales, /api/profit, /api/reports")
    app.run(debug=True, port=5000)
