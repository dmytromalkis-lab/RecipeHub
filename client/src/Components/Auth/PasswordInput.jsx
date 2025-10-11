import './Input.css';

export default function PasswordInput({ passwordLabelName = "Password" }) {
  return (
    <div className="form-group">
      {/* <label>{passwordLabelName}</label> */}
      <input type="password" placeholder={passwordLabelName} required/>
    </div>
  );
};
