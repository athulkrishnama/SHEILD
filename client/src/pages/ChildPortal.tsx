import { useState } from "react";
import GiftRequestForm from "../components/GiftRequestForm";

export default function ChildPortal() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green bg-clip-text text-transparent">
            🎄 Santa's Gift Portal 🎅
          </h1>
          <p className="text-lg text-gray-300">
            Tell us what you want for Christmas and our superhero team will
            deliver it!
          </p>
        </div>

        {/* Form */}
        {!submitted ? (
          <div className="card">
            <GiftRequestForm onSuccess={() => setSubmitted(true)} />
          </div>
        ) : (
          <div className="card text-center animate-fade-in">
            <div className="text-6xl mb-4">🎁✨</div>
            <h2 className="text-3xl font-display font-bold mb-4 text-christmas-gold">
              Request Submitted!
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Santa is assigning a superhero to deliver your gift!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn btn-primary"
            >
              Submit Another Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
