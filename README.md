# 👗 Drapely AI - AI Powered Virtual Saree Try-On

An AI-powered Virtual Saree Try-On web application that allows users to upload a person image and a saree image to generate a virtual try-on result using the IDM-VTON model through the Hugging Face Gradio API.

---

## 🚀 Features

- 📸 Upload user image
- 👗 Upload custom fashion clothes images
- 🤖 AI-powered virtual try-on generation
- ⚡ FastAPI backend
- 🎨 React + Vite frontend
- ☁️ Hugging Face Gradio API integration
- 📥 Download generated image
- 📱 Responsive modern UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- FastAPI
- Python
- Uvicorn

### AI
- IDM-VTON
- Hugging Face Gradio API
- Gradio Client

---

## 📂 Project Structure

```
TRY_ON_GIRL_IMAGE_GENERATION
│
├── backend/
│   ├── app/
│   ├── uploads/
│   ├── outputs/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docs/
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/vranjange-lab/TRY_ON_IMAGE_GENERATION.git
```

```
cd TRY_ON_IMAGE_GENERATION
```

---

## Backend Setup

Create a virtual environment

```bash
python -m venv ai_env
```

Activate

### Windows

```bash
ai_env\Scripts\activate
```

Install dependencies

```bash
pip install -r backend/requirements.txt
```

Run Backend

```bash
cd backend
uvicorn app.main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## 🖼 How it Works

1. Upload a person image.
2. Upload a saree image.
3. Click **Generate**.
4. Images are sent to the FastAPI backend.
5. Backend calls the Hugging Face Gradio IDM-VTON API.
6. The AI generates the virtual try-on image.
7. The generated result is displayed in the frontend.
8. Users can download the generated image.

---

## 📸 Screenshots

> Add screenshots of your application here.

---

## Future Improvements

- Better garment fitting accuracy
- Multiple clothing categories
- User authentication
- Cloud deployment
- High-resolution output
- Batch processing

---

## 👨‍💻 Developer

**Vedant Ranjange**

GitHub:
https://github.com/vranjange-lab

LinkedIn:
https://www.linkedin.com/in/vedant-ranjange-78bba8375

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub.

---

## 📄 License

This project is developed for educational and research purposes.
