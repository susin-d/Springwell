# Springwell - AI Groundwater Insights

Springwell is an AI-powered platform for analyzing and visualizing groundwater data across India. It provides clear, actionable insights for farmers, policymakers, and researchers through interactive maps, data analytics, and conversational AI.

## Features

- **AI-Powered Conversations**: Chat with Springwell in English and Tamil to get instant insights about groundwater data, trends, and predictions.
- **Interactive Maps**: Visualize groundwater levels, rainfall patterns, and water stress across India with real-time data layers.
- **Advanced Analytics**: Deep dive into correlations, trends, and predictive models with comprehensive data visualizations.
- **Real-Time Monitoring**: Track 12,500+ active monitoring wells with live updates and automated alert systems.
- **Data Security**: Enterprise-grade security with encrypted data transmission and secure API integrations.

## Installation and Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "AI chatbot - Yeswanth raj"
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.local` and set your API keys
   - Set `API_KEY` to your Gemini API key

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── components/ui/          # Reusable UI components
├── pages/                  # Page components
│   ├── Dashboard/          # Dashboard pages and components
│   └── ...
├── services/               # API services
├── App.tsx                 # Main app component
├── index.tsx               # App entry point
└── ...
```

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI**: Tailwind CSS, Lucide Icons
- **Maps**: Leaflet, React-Leaflet
- **AI**: Google Gemini API
- **Charts**: Custom chart components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and build
5. Submit a pull request

## License

This project is licensed under the MIT License.