import "./login.css"
import faleza2 from "./img/faleza2.jpg";
import logo from "./img/portman-hotel-website-favicon-white.png"

import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";

// Redux
import {useSelector, useDispatch} from "react-redux";
import {login, reset} from "../../features/auth/authSlice";
import {toast} from "react-toastify";

// import components
import Header from "../../components/Header/Header";
import RegisterFormInput from "../../components/RegisterFormInput/RegisterFormInput"; 


function Login() {

    const [values, setValues] = useState({
        email: "",
        password: "",
      })

    const {email, password} = values;
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

    useEffect(() => {
        if(isError)
          toast.error(message);
  
        if(isSuccess)
          toast.success(message)
          
        if(user)
          navigate("/");
  
        dispatch(reset());
      }, [user, isError, isSuccess, message, navigate, dispatch])
    
      function addBackslash(str) {
        return str.replace(/[$^*.?"{}|]/g, "\\$&");
      }

      const inputs = [
        {
          id: 1,
          name: "email",
          type: "email",
          label: "Email",
          errorMessage: "Adăugați o adresă de email validă.",
          required: true
        },
        {
          id: 2,
          name: "password",
          type: "password",
          label: "Parola",
          errorMessage: "Adăugați parola contului dvs.",
        //   pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>`~;/\[\]])",
          required: true
        }
      ]
    //$ ^ * . ? " { } |

    
    function checkValidity() {
      let input1 = document.getElementById("1");
      let input2 = document.getElementById("2");

      if(input1 && input2) {
        if(input1.checkValidity() && input2.checkValidity())
          return true;
      } 
      else 
        return false;
    }
    // `~:;'/"
    
    
    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {email, password}
        dispatch(login(userData));
      }
      
    
      const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
      }


  return (
    <>    
    <Header main = {false} />
    <main>
    <div className="container">
        <div className="register-container form-login-container">
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
                            <h2>Autentificare</h2>

                            <div className="inputs">
                                {inputs.map(input => (<RegisterFormInput key={input.id} {...input} value={values[input.name]} onChange={onChange}
                                login = {true} />))}
                                <button type="submit" className="button-86 form-login" disabled = {checkValidity() === true ? false : true}>Submit</button>
                            </div>
                            <div className="login-register">
                                <p>Nu ți-ai făcut cont? <Link to="/register">Înregistrare</Link></p>
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

export default Login
