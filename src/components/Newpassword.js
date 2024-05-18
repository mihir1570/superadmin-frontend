import React, { useEffect, useState } from "react";
import PasswordChecklist from "react-password-checklist"
import { useNavigate, useParams } from "react-router-dom";
import create_password from './img/create_password.jpg'
import BASE_URL from './config';


const Newpassword = () => {
  const [password, setPassword] = useState("")
  const [passwordAgain, setPasswordAgain] = useState(" ")
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const navigate = useNavigate()
  const parmas = useParams()


  useEffect(() => {
    checkpassword();

  }, []);


  // for check old email link not work "means user can not re change password using same link"
  const checkpassword = async () => {
    const datas = await fetch(`http://localhost:4600/checkpassword`, {
      method: "post",
      body: JSON.stringify({ email: parmas.email }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const results = await datas.json()
    if (results) {
      // alert(results.password)
      console.log(results);
      setCheckPassword(results.password)
    }
    else {
      alert(results.error)
    }
  }


  useEffect(() => {
    setPasswordsMatch(password === passwordAgain);
  }, [password, passwordAgain]);


  const setpassword = async () => {

    console.log(parmas.email)
    console.log(password)
    const result = await fetch(`http://localhost:4600/updatesavedata/${parmas.email}`, {
      method: "Put",
      body: JSON.stringify({ password }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    const ans = await result.json()
    if (ans) {
      alert("changed Password")
      // navigate("/agentlogin")
      checkpassword();
    }
  }
  return (
    <>

      {
        checkPassword != "admin@123" ?

          <div class="page-container">
            <div class="changed-password-card">
              <div class="changed-password-container">
                <h2>Password Changed Successfully</h2>
                <p>Dear Admin,</p>
                <p>Your account password has been successfully changed. Your account is now secure.</p>
                <p>Please proceed to the admin panel and log in using your new password.</p>
                <a href="http://localhost:3001/" class="btn">Go to Admin Panel</a>
              </div>
            </div>
          </div>
          :
          <section className="vh-100" style={{ backgroundColor: "#f2f2f2" }}>
            <div className="container py-5 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-xl-10">
                  <div className="card shadow-lg rounded-3">
                    <div className="row g-0">
                      <div className="col-md-6 col-lg-5 d-none d-md-block">
                        <img src={create_password} alt="login form" className="img-fluid card-img-top rounded-start" style={{ objectFit: "cover", height: "100%", borderRadius: "1rem 0 0 1rem" }} />
                      </div>
                      <div className="col-md-6 col-lg-7 d-flex align-items-center">
                        <div className="card-body p-4 p-lg-5 text-black">

                          <form>

                            <div className="d-flex align-items-center mb-3 pb-1">
                              <h1 className="fw-bold mb-0">Create a new password</h1>
                            </div>

                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="form2Example17">New Password</label>
                              <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Admin@123" className="form-control form-control-lg" required />
                            </div>

                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="form2Example27">Confirm Password</label>
                              <input type="password" onChange={e => setPasswordAgain(e.target.value)} placeholder="Admin@123" className="form-control form-control-lg" required />
                            </div>

                            <div className="form-outline mb-4">
                              <PasswordChecklist
                                rules={["minLength", "specialChar", "number", "capital", "match"]}
                                minLength={5}
                                value={password}
                                valueAgain={passwordAgain}
                                onChange={(isValid) => { }}
                              />
                            </div>

                            <div className="pt-1 mb-4">
                              {passwordsMatch && <button type="button" className="btn btn-dark btn-lg btn-block" onClick={setpassword}>Set Password</button>}
                            </div>

                          </form>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
      }
    </>
  )
}
export default Newpassword;















