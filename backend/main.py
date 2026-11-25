
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="NEXMOTION AI",
    description="Next-Generation Mobility Intelligence Platform",
    version="1.0.0"
)

# Allow the React development server to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initial demonstration data — not real GPS telemetry
vehicles = [
    {
        "id": "NX-001",
        "driver": "Rahul Sharma",
        "type": "Delivery Van",
        "status": "Moving",
        "speed": 54,
        "fuel": 78,
        "latitude": 26.2183,
        "longitude": 78.1821
    },
    {
        "id": "NX-002",
        "driver": "Amit Verma",
        "type": "Heavy Truck",
        "status": "Moving",
        "speed": 68,
        "fuel": 62,
        "latitude": 26.2283,
        "longitude": 78.1921
    },
    {
        "id": "NX-003",
        "driver": "Priya Singh",
        "type": "Electric Van",
        "status": "Idle",
        "speed": 0,
        "fuel": 91,
        "latitude": 26.2083,
        "longitude": 78.1721
    },
    {
        "id": "NX-004",
        "driver": "Vikas Patel",
        "type": "Delivery Van",
        "status": "Alert",
        "speed": 82,
        "fuel": 24,
        "latitude": 26.2383,
        "longitude": 78.1621
    },
    {
        "id": "NX-005",
        "driver": "Rohit Jain",
        "type": "Electric Truck",
        "status": "Moving",
        "speed": 46,
        "fuel": 56,
        "latitude": 26.1983,
        "longitude": 78.2021
    }
]


@app.get("/")
def home():
    return {
        "project": "NEXMOTION AI",
        "tagline": "Moving Beyond Mobility",
        "status": "operational"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NEXMOTION backend",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.get("/api/vehicles")
def get_vehicles():
    return {
        "source": "simulated_demo_data",
        "count": len(vehicles),
        "vehicles": vehicles
    }


@app.get("/api/summary")
def get_summary():
    return {
        "total_vehicles": len(vehicles),
        "moving": sum(v["status"] == "Moving" for v in vehicles),
        "idle": sum(v["status"] == "Idle" for v in vehicles),
        "alerts": sum(v["status"] == "Alert" for v in vehicles),
        "data_source": "simulated_demo_data"
    }
