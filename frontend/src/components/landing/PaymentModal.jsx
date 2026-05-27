export default function PaymentModal({ onClose, onSuccess }) {
  return (
    <div className="modal">
      <div className="card modal-card payment-card">
        <h2>Mock Payment</h2>
        <input placeholder="Cardholder Name" />
        <input placeholder="Card Number" />
        <input placeholder="Expiry Date" />
        <input placeholder="CVV" />
        <input placeholder="Billing Email" />
        <button onClick={onSuccess}>Complete Payment</button>
        <button className="secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
