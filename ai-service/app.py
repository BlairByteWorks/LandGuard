from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient

app = Flask(__name__)
CORS(app) 

# ==========================================
# 1. MONGODB DYNAMIC TRAINING
# ==========================================
print("Connecting to MongoDB to train AI Model...")

# 🚨 IMPORTANT: Replace this string with the exact MongoDB URI from your Node.js .env file!
# Example: 'mongodb+srv://tony:YourPassword@cluster0.../landguard_db'
MONGO_URI = 'mongodb+srv://admin:LandGuard2026@cluster0.m2thxdh.mongodb.net/LandGuard?appName=Cluster0' # (Default local DB string)

try:
    client = MongoClient(MONGO_URI)
    db = client.get_default_database() # Auto-selects the DB from your URI
    
    # Check if your collection is named 'properties' or 'Property'. Adjust if needed!
    properties_collection = db['properties'] 

    # Fetch ONLY 'Verified' properties to use as pristine training data
    verified_properties = list(properties_collection.find({'status': 'Verified'}))

    # We need at least 3 properties to draw a mathematical line. 
    if len(verified_properties) >= 3:
        print(f"SUCCESS: Found {len(verified_properties)} Verified properties. Training on live data!")
        
        # Loop through the database results and format them for Pandas
        data = {
            'Size_Acres': [prop.get('sizeAcres', 0) for prop in verified_properties],
            'Location': [prop.get('locationWard', 'Unknown') for prop in verified_properties],
            'Price_Ksh': [prop.get('listingPrice', 0) for prop in verified_properties]
        }
        df = pd.DataFrame(data)
    else:
        print("Not enough verified properties in DB yet. Using baseline fallback data...")
        # Baseline data to keep the system running until the DB fills up
        data = {
            'Size_Acres': [0.25, 0.5, 1.0, 0.25, 0.5, 2.0, 0.125, 1.0, 4.5,  2.0,  0.5],
            'Location': ['Kilimani', 'Kilimani', 'Karen', 'Karen', 'Westlands', 'Westlands', 'Ruiru', 'Ruiru', 'Mombasa Rd', 'Mombasa Rd', 'Mombasa Rd', 'Runda'],
            'Price_Ksh': [12000000, 22000000, 35000000, 15000000, 28000000, 80000000, 2500000, 1800000, 65000000, 32000000, 9000000, 75000000]
        }
        df = pd.DataFrame(data)

except Exception as e:
    print(f"MongoDB connection failed: {e}. Falling back to baseline data.")
    # Safe fallback if MongoDB is offline
    data = {
        'Size_Acres': [0.25, 0.5, 1.0],
        'Location': ['Kilimani', 'Westlands', 'Karen'],
        'Price_Ksh': [15000000, 28000000, 35000000]
    }
    df = pd.DataFrame(data)

# One-Hot Encoding: Converts text locations into binary columns
df_encoded = pd.get_dummies(df, columns=['Location'])

# Train the Linear Regression Model
X = df_encoded.drop('Price_Ksh', axis=1) # Features
y = df_encoded['Price_Ksh']              # Target

model = LinearRegression()
model.fit(X, y)
print("Model trained and ready!")

# ==========================================
# 2. THE PREDICTION ENDPOINT
# ==========================================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        req_data = request.get_json()
        size = float(req_data.get('sizeAcres'))
        location = req_data.get('locationWard')
        asking_price = float(req_data.get('askingPrice'))

        input_data = pd.DataFrame(columns=X.columns)
        input_data.loc[0] = 0 
        
        input_data['Size_Acres'] = size

        # The "Unknown Area" Safety Net
        loc_column = f'Location_{location}'
        area_is_known = False

        if loc_column in input_data.columns:
            input_data[loc_column] = 1
            area_is_known = True

        predicted_price = model.predict(input_data)[0]

        # Prevent divide-by-zero errors if price dips to 0
        if predicted_price <= 0:
            predicted_price = 1000000 # Floor value
            
        variance_percentage = abs(predicted_price - asking_price) / predicted_price * 100
        
        # If we don't know the area, drop the confidence score dramatically!
        confidence = 85 if area_is_known else 40

        return jsonify({
            'predictedPrice': round(predicted_price, 2),
            'variancePercentage': round(variance_percentage, 2),
            'isHighRisk': bool(variance_percentage > 20),
            'confidence': confidence
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)