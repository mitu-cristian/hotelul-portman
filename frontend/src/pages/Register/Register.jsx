import "./register.css"
import faleza2 from "./img/faleza2.jpg";
import logo from "./img/portman-hotel-website-favicon-white.png"

import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";

// Redux
import {toast} from "react-toastify"
import {useSelector, useDispatch} from "react-redux";
import {register, reset} from "../../features/auth/authSlice";

// import components
import Header from "../../components/Header/Header";
import RegisterFormInput from "../../components/RegisterFormInput/RegisterFormInput"; 


function Register() {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    useEffect(() => {
      if(isError)
          toast.error(message);

      if(isSuccess)
          toast.success(message);

      if(user) 
          navigate("/");
      
      dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch] )

    const [values, setValues] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
      })

      const {firstname, lastname, email, password, confirmPassword} = values;
    
      function addBackslash(str) {
        return str.replace(/[$^*.?"{}|]/g, "\\$&");
      }

      const inputs = [
        {
          id: 1,
          name: "firstname",
          type: "text",
          label: "Prenume",
          errorMessage: "Adăugați un prenume valid.",
          pattern: "^^[A-Za-z ]+$",
          required: true,
        },
        {
          id: 2,
          name: "lastname",
          type: "text",
          label: "Nume de familie",
          errorMessage: "Adăugați un nume de familie valid.",
          pattern: "^[A-Za-z ]+$",
          required: true
        },
        {
          id: 3,
          name: "email",
          type: "email",
          label: "Email",
          errorMessage: "Adăugați o adresă de email validă.",
          required: true
        },
        {
          id: 4,
          name: "password",
          type: "password",
          label: "Parola",
          errorMessage: "Parola trebuie să conțină",
          pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>`~;/\[\]])",
          required: true
        },
        {
          id: 5,
          name: "confirmPassword",
          type: "password",
          label: "Reintroduceți parola",
          errorMessage: "Parolele diferă.",
          pattern: addBackslash(values.password),
          required: true
        }
    
      ]
    //$ ^ * . ? " { } |

    
    function checkValidity() {
      let input1 = document.getElementById("1");
      let input2 = document.getElementById("2");
      let input3 = document.getElementById("3");
      let input4 = document.getElementById("4");
      let input5 = document.getElementById("5");
      if(input1 && input2 && input3 && input4 && input5) {
        if(input1.checkValidity() && input2.checkValidity() && input3.checkValidity && input4.checkValidity() && input5.checkValidity() &&
        values.password === values.confirmPassword)
          return true;
      } 
      else 
        return false;
    }
    // `~:;'/"
    
      const lowerCase = /[a-z]/.test(values.password);
      const upperCase = /[A-Z]/.test(values.password);
      const number = /\d/.test(values.password);
      const specialCharacter = /[!@#$%^&*(),.?\":{}|<>`~;/\[\]]/.test(values.password);
      const length = values.password.length > 7;
    
      const onSubmit = (e) => {
        e.preventDefault();
            const userData = {firstname, lastname, email, password};
            dispatch(register(userData));
    }

    
      const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
      }


  return (
    <>    
    <Header main = {false}/>

    <main>
    <div className="container">
        <div className="register-container">
            <div className="container-img">
                <img src={faleza2}/>
                <div className="content">
                    <div className="text-sci">
                        <h2>Bun venit!<br/></h2>
                    </div>

                    <h2 className="logo-form">Hotelul Portman</h2>
                    <img src={logo} alt=""/>
                </div>

                <div className="logreg-box">
                    <div className="form-box">
                        <form onSubmit={onSubmit} className="register-form">
                            <h2>Înregistrare</h2>

                            <div className="inputs">
                                {inputs.map(input => (<RegisterFormInput key={input.id} {...input} value={values[input.name]} onChange={onChange}
                                lowerCase = {lowerCase} upperCase = {upperCase} number = {number} specialCharacter = {specialCharacter}
                                length = {length}
                                />))}
                                <button type="submit" className="button-86 form-register" disabled = {checkValidity() === true ? false : true}>Submit</button>
                            </div>
                            <div className="login-register">
                                <p>Ai deja cont? <Link to="/login">Autentificare</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
    </>

  )
}

export default Register
