import "./registerFormInput.css";
import {useState, useRef} from "react";

function RegisterFormInput(props) {

    const {login, lowerCase, upperCase, number, specialCharacter, length, label, errorMessage, onChange, id, ...inputProps} = props;
    const [focused, setFocused] = useState(false)
    const inputRef = useRef("")

    const handleFocus = (e) => {
        setFocused(true);
    }

  return (
    <div className="formInput">
      <div className="input">
        <section className="input-content">
          <div className="input-content-wrap">
            <dl className="inputbox">
              <dd className="inputbox-content">
                <input {...inputProps} 
                    id = {id}
                      ref = {inputRef}
                      onChange={onChange} onBlur = {handleFocus} focused = {focused.toString()}
                    onFocus = {() => inputProps.name === "confirmPassword" && setFocused(true)}/>
                <div className="underline"></div>
                <label >{label}</label>
              <span className="error-message">{errorMessage}</span>
              </dd>
            </dl>
          </div>
        </section>
      </div>



      {(inputProps.name === "password" && login !== true)  ? (
      <>
      <div className={lowerCase ? 'info checked' : 'info'}>O literă mică.</div>
      <div className={upperCase ? 'info checked' : 'info'}>O literă mare.</div>
      <div className={number ? 'info checked' : 'info'}>Un număr.</div>
      <div className={specialCharacter ? 'info checked' : 'info'}>Un caracter special.</div>
      <div className={length ? 'info checked' : 'info'}>Lungime de cel puțin 8 caractere.</div>
      </>) : ""
      }
    </div>
  )
}
//  !@#$%^&*(),.?":{}|&lt;&gt;`~;/[]
export default RegisterFormInput
