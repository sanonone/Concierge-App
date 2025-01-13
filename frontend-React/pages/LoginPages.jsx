import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/Logo1.jpg";
import LogoConcierge from "../assets/LogoConcierge.png";

function LoginPage(props) {
  const url = props.url
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [wrongPass, setWrongPass] = useState(false);
  const [deactivatedLogin, setDeactivatedLogin] = useState(false);
  const image =
    "https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const hotel = "https://images.unsplash.com/photo-1569664370706-e26397378b09?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const letto = "https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const hotel2 = "https://images.unsplash.com/photo-1568652623543-c42c25821193?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const logo =
    "https://www.tecnologiaeturismo.org/wp-content/uploads/2020/12/turismo-tecnologia-logo-TT-piccolo.png";
  const linkSito = "https://www.tecnologiaeturismo.org";
  //const url = "http://localhost:3000/"
  //const url = "https://us-central1-fir-autenticazione-d201f.cloudfunctions.net/api/"

  const handleInputChangeUsername = (e) => {
    const { name, value } = e.target;
    setFormUsername(value);
    console.log(value);
  };

  const handleInputChangePassword = (e) => {
    const { name, value } = e.target;
    setFormPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWrongPass(false);
    login(formUsername, formPassword);
  };

  /*
  const login = async (username, password) => {
    await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setToken(data);
        console.log(data.token);
      });
    
    console.log(token.status)
    if(token.status!="error"){
      localStorage.setItem("token", JSON.stringify(token));
      navigateToHome()
    }
    
    
  };
  */

  const login = async (username, password) => {
    try {
      const response = await fetch(`${url}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status == "deactivated") {
          console.log("account disattivato")
          setDeactivatedLogin(true)
        } else {
          setToken(data.token);
          sessionStorage.setItem("token", data.token);
          const codStrutturaAsNumber = parseInt(data.codStruttura, 10);
          sessionStorage.setItem(
            "codStruttura",
            JSON.stringify(codStrutturaAsNumber)
          );
          
          sessionStorage.setItem("ipStruttura", data.ipStruttura)
          sessionStorage.setItem("DBname", data.DBname)
          sessionStorage.setItem("Username", username)
          sessionStorage.setItem("IdAzienda", data.IdAzienda)
          sessionStorage.setItem("IdUser", data.id)
          sessionStorage.setItem("sincronizza", true);
          sessionStorage.setItem("tokenNotifyStruttura", JSON.stringify(data.tokenNotify));
          sessionStorage.setItem("idStripe", data.idStripe)
          sessionStorage.setItem("tipoConfigurazione", data.tipoConfigurazione.value)


          if (data.admin == true) {
            navigateToAdminPanel()
          } else {
            // Reindirizza l'utente alla home
            navigateToHome();
          }
        }

      }
      else {
        // Gestisci il caso in cui la risposta non è ok (errore di autenticazione)

        setWrongPass(true);
        console.log("Errore di autenticazione");
      }
    } catch (error) {
      console.error("Errore durante il login", error);
    }
  };

  function navigateToHome() {
    navigate("/");
  }

  function navigateToAdminPanel() {
    navigate("/Admin");
  }

  //<div className="p-10 bg-gray-200 flex justify-center items-center h-screen">
  //input username  border-2 focus:outline-none focus:border-indigo-500 border-sky-900 rounded-md h-9
  return (
    <>
      <div
        className="p-10 bg-image flex justify-center items-center h-screen "
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="  flex flex-col items-center justify-center h-[300px] w-80 mb-10 bg-[rgba(255,255,255,0)] rounded-lg gap-5"
        >
          <a
            className="h-[350px] w-[350px] mb-6 rounded-lg"
            href={linkSito}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={LogoConcierge}
              alt="Logo"
              width={350}
              height={350}
              className=" mt-6 mb-2 rounded-lg"
            />
          </a>
          <div className="flex items-center my-3 bg-[rgba(255,255,255,0.1)] text-white rounded-full w-80">
            <div className=" w-5 h-5 mx-2 ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <input
              className="p-3 py-4 bg-[rgba(255,255,255,0.1)] w-full text-white rounded-r-full outline-0 placeholder:text-white"
              placeholder="Username"
              type="text"
              name="nome"
              value={formUsername}
              onChange={handleInputChangeUsername}
            />
          </div>

          <div className="flex items-center my-3 bg-[rgba(255,255,255,0.1)] text-white rounded-full w-80">
            <div className="w-5 h-5 mx-2 ml-4 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              className=" p-3 py-4 bg-[rgba(255,255,255,0.1)] w-full text-white rounded-r-full outline-0 placeholder:text-white"
              placeholder="Password"
              type="password"
              name="nome"
              value={formPassword}
              onChange={handleInputChangePassword}
            />
          </div>
          <div>
            {wrongPass && (
              <h2 className=" p-1 flex justify-center text-red-700 text-xl font-semibold bg-[rgba(255,255,255,0.3)] rounded-full">
                Username o password errati
              </h2>
            )}
            {deactivatedLogin && (
              <h2 className=" px-8 flex justify-center text-red-700 text-xl font-semibold bg-[rgba(255,255,255,0.3)] rounded-full">
                Questo account è stato disattivato, per maggiori informazioni contattare l'assistenza
              </h2>
            )}
          </div>
          <button
            type="submit"
            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-blue-800 text-white font-bold py-4 rounded-full w-full"
          >
            Login
          </button>
        </form>
      </div>
      <Footer></Footer>
    </>
  );
}

export default LoginPage;
