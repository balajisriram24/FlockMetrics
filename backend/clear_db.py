from pathlib import Path
import os
from pymongo import MongoClient
from dotenv import load_dotenv


def main():
    # Load .env from backend folder if present
    load_dotenv(Path(__file__).parent / ".env")
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        print("No MONGODB_URI found in environment or backend/.env")
        return 1

    print(f"Using MONGODB_URI from backend/.env")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Use the same database name as the app
        db = client["livestock_db"]

        colls = db.list_collection_names()
        if not colls:
            print("Database has no collections to drop.")
            return 0

        print("Collections to drop:")
        for c in colls:
            print(" -", c)

        # Drop all collections
        for c in colls:
            db.drop_collection(c)
            print(f"Dropped collection: {c}")

        print("All collections dropped from 'livestock_db'.")
        return 0
    except Exception as e:
        print("Error connecting to MongoDB:", e)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
