# Environment Setup Instructions

## Backend Environment (.env file)

Create a file named `.env` in the `Edventure-backend` directory with the following content:

```
# API Keys
GEMINI_API_KEY=AIzaSyBOgemmbrwEhox1rEasakp38dsbjSPxLvk
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Application Settings
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-for-jwt-tokens

# Database Settings
DATABASE_PATH=database.db
```

## Frontend Environment (.env.local file)

Create a file named `.env.local` in the `Edventure-frontend` directory with the following content:

```
# API Keys for AI services
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyCy4-wPjHJB03w-spa2IvcOIJbb9WOyB7o
NEXT_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-api-key-here

# Feature flags 
NEXT_PUBLIC_ENABLE_TEXT_TO_SPEECH=true

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
```

## Important Notes

1. Replace `your-elevenlabs-api-key` and `your-elevenlabs-api-key-here` with your actual ElevenLabs API key, which you can get from [ElevenLabs](https://elevenlabs.io/)

2. For security in production, you should replace `your-secret-key-for-jwt-tokens` with a strong randomly generated key

3. The `NEXT_PUBLIC_` prefix for frontend environment variables is required for Next.js to expose these variables to the browser

4. After creating these files, restart both your frontend and backend servers for the changes to take effect 