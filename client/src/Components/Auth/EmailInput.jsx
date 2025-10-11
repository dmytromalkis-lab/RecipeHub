import './Input.css';

export default function EmailInput({ emailLabelName = "Email" }) {
  return (
    <div className="form-group">
      {/* <label>Email</label> */}
      <input type="email" placeholder={emailLabelName} required/>
    </div>
  );
}
